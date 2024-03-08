import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

export default function MenuItem(props) {
  const commonTable = useSelector(state => state.commonTable);
  const orders = useSelector(state => state.orders);
  const kioskId = useSelector(state => state.kiosk);
  const dispatch = useDispatch();
  const { category, id, setId } = props;
  const [menu, setMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState({});
  const [showModal, setShowModal] = useState(false);
  // 기타 옵션
  const [checked, setChecked] = useState({});
  // 개인 옵션
  const [wrap, setWrap] = useState(0);
  // 포장 옵션
  const [bag, setBag] = useState(2019); // 초기값 2019로 설정
  const [options, setOptions] = useState({
    etc: [],
    bag: [],
    self: []
  });
  // 메뉴 개수 state
  const [count, setCount] = useState(1);
  // 이미지 리시트
  const [imgList, setImgList] = useState([])
  // 장바구니 추가
  const addCart = (item, options) => {
    const order = {
      id: id,
      kiosk_id: kioskId,
      menu_name: item.name,
      menu_price: item.price,
      menu_count: count,
      options: options
    };
    setId(id + 1);
    let list = [...orders, order];
    const action = {
      type: "UPDATE_ORDERS",
      payload: list
    };
    dispatch(action);
    closeModal();
  };

  // 모달 닫는 함수
  const closeModal = () => {
    setShowModal(false);
    setCount(1);
    setChecked({});
    setWrap(0);
    setBag(2019); // 모달이 닫힐 때 다시 초기값으로 설정
  };

  // 상세 모달 열릴시
  const openModal = (item, index) => {
    const list = [];
    let newItem = {...item,index:index}
    setSelectedMenu(newItem);

    for (let tmp of commonTable) {
      if (tmp.p_code_id === item.category_id) {
        list.push(tmp);
      }
    }
    setOptions({ ...options, self: list });
    setShowModal(true);
  };

  // 체크박스 선택시 옵션 저장 함수
  const handleChange = (e, item) => {
    const isChecked = e.target.checked;
    setChecked({
      ...checked,
      [item.code_id]: isChecked
    });
  };

  // 옵션을 DB에 넣기 위해 리스트 형태로 변형
  const convertOption = () => {
    let result = "";
    if (wrap !== 0) {
      result += wrap + ", ";
    }

    if (bag !== 0) {
      result += bag + ", ";
    }

    let etcKeys = Object.keys(checked).filter(key => checked[key] === true);
    etcKeys.forEach(tmp => (result += tmp + ", "));
    return result;
  };

  useEffect(() => {
    /** 카테고리에 맞는 menu를 출력 */
    axios.post("/api/menu/list", { category_id: category })
      .then(res => {
        res.data.list.forEach(item => getMenuImage(item.img_name))
        setMenu(res.data.list)
      })
      .catch(error => console.log(error));
    /** 공통 option 설정 */
    const etcList = [];
    const bagList = [];
    for (let item of commonTable) {
      if (item.p_code_id === 2012) {
        etcList.push(item);
      }

      if (item.p_code_id === 2016) {
        bagList.push(item);
      }
    }
    setOptions({ ...options, etc: etcList, bag: bagList });

    // 포장 옵션 초기값 설정
    setBag(2019); // 기본값으로 2019 설정
  }, []);

  // 개수 빼기 함수
  const minus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  // 개수 추가 함수
  const plus = () => {
    if (count < 9) {
      setCount(count + 1);
    }
  };

  // 메뉴의 이름과 가격을 정리해주는 함수
  const arrangeItem = (item) => {
    let result = "";

    if (item.code_value === 0) {
      result = item.code_name;
    } else {
      result = item.code_name + " " + item.code_value + "원";
    }

    return result;
  };

  // 서버에서 이미지 가져오기
  const getMenuImage = (img_name) => {
    axios.post("/upload/images", { name: img_name },
      { responseType: 'blob' })
      .then(res => {
        const reader = new FileReader()
        reader.readAsDataURL(res.data)
        reader.onload = (e) => {
          setImgList(prevList => [...prevList, e.target.result])
        }
      })
  }

  return (
    <>
      {menu.map((item, index) => (
        <Card style={{ width: "23.5%" }} className="me-3" key={item.id}>
          <Card.Img variant="top" src={imgList[index]} style={{ width: "100%" }} className="mt-3" />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.summary}</Card.Text>
            <Card.Text>{item.price}원</Card.Text>
            <Button variant="primary" onClick={() => openModal(item,index)}>
              주문하기
            </Button>
          </Card.Body>
        </Card>
      ))}
      {/* 메뉴 상세 정보 modal */}
      <Modal
        size="lg"
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCount(1);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>메뉴 상세정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Image src={imgList[selectedMenu.index]} style={{ width: "100%" }} />
            </Col>
            <Col>
              <h1>
                {selectedMenu.name} {selectedMenu.price}원
              </h1>
              <h2>{selectedMenu.summary}</h2>
              <h3>{selectedMenu.description}</h3>
            </Col>
          </Row>
          <Row>
            <h1>포장지 옵션</h1>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.self.map(item => (
                <Col key={item.code_id}>
                  <Card className="me-3">
                    <Card.Img variant="top" src={"/images/" + item.code_img} style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check
                          inline
                          label={arrangeItem(item)}
                          type="radio"
                          name="group1"
                          value={item.code_id}
                          onChange={(e) => {
                            setWrap(e.target.value);
                          }}
                        />
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Row>
          <Row>
            <h1>기타 옵션</h1>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.etc.map(item => (
                <Col key={item.code_id}>
                  <Card className="me-3">
                    <Card.Img variant="top" src={"/images/" + item.code_img} style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check
                          inline
                          label={arrangeItem(item)}
                          type="checkbox"
                          checked={checked[item.code_id] || false}
                          onChange={(e) => handleChange(e, item)}
                        />
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Row>
          <Row className="mt-3">
            <h1>포장 옵션</h1>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.bag.map(item => (
                <Col key={item.code_id}>
                  <Card className="me-3">
                    <Card.Img variant="top" src={"/images/" + item.code_img} style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check
                          inline
                          label={arrangeItem(item)}
                          name="group2"
                          type="radio"
                          value={item.code_id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBag(e.target.value);
                            } else {
                              setBag(2019);
                            }
                          }}
                          checked={bag === item.code_id || (bag === 2019 && !Object.keys(checked).length)}
                        />
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Row>
          <Row className="text-end">
            <h1>
              <Button variant="link" size="lg" style={{ color: "black" }} onClick={minus}>
                <DashCircle />
              </Button>
              {count}
              <Button variant="link" size="lg" style={{ color: "black" }} onClick={plus}>
                <PlusCircle />
              </Button>
            </h1>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button variant="secondary" onClick={closeModal}>
                닫기
              </Button>
            </Col>
            <Col md="auto">
              <Button
                variant="primary"
                type="button"
                onClick={() => {
                  addCart(selectedMenu, convertOption());
                }}
              >
                추가하기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
}
