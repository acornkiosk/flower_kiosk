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
  const { id, setId, menu } = props
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
  const [imgList, setImgList] = useState({})
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
  const openModal = (item) => {
    if (item.is_sold === "false") {
      const list = [];
      setSelectedMenu(item);
      for (let tmp of commonTable) {
        if (tmp.p_code_id === item.category_id) {
          list.push(tmp);
        }
      }
      setOptions({ ...options, self: list });
      setShowModal(true);
    }
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
    menu.forEach(item => getMenuImage(item.img_name))
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
  // 메뉴의 이름을 정리해주는 함수
  const arrangeItemName = (item) => {
    let result = "";
    if (item.code_value === 0) {
      result = item.code_name;
    } else {
      result = item.code_name;
    }
    return result;
  };
  // 메뉴의 가격을 정리해주는 함수
  const arrangeItemPrice = (item) => {
    let result = "";
    if (item.code_value === 0) {
      result = item.code_value;
    } else {
      result = item.code_value + "원";
    }
    return result;
  };
  // 서버에서 이미지 가져오기
  const getMenuImage = (img_name) => {
    if (img_name) {
      axios.post("/upload/images", { name: img_name },
        { responseType: 'blob' })
        .then(res => {
          const reader = new FileReader()
          reader.readAsDataURL(res.data)
          reader.onload = (e) => {
            setImgList(prevImgList => ({ ...prevImgList, [img_name]: e.target.result }))
          }
        })
    }
  }
  return (
    <>
        {menu.map(item => (
          <Card style={{ fontFamily: "Chanssam", width: "20%" }} className="ms-3 me-3" key={item.id} onClick={() => openModal(item)}>
            <div className="position-relative">
              {item.is_sold === "true" &&
                <div className="position-absolute">
                  <Card.Img variant="top" src="images/sold_out.png" style={{ width: "100%" }} className="mt-3" />
                </div>
              }
              <Card.Img variant="top" src={item.img_name ? imgList[item.img_name] : "images/no_image.png"} style={{ width: "100%" }} className="mt-3" />
            </div>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>{item.summary}</Card.Text>
              <Card.Text>{item.price}원</Card.Text>
            </Card.Body>
          </Card>
        ))}
      {/* 메뉴 상세 정보 modal */}
      <Modal
        size="lg"
        centered
        show={showModal}
        style={{ fontFamily: "Chanssam" }}
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
              <Image src={imgList[selectedMenu.img_name]} style={{ width: "100%" }} />
            </Col>
            <Col>
              <div className="border-bottom secondary" style={{
                padding: "30px",
                border: "1px solid #F8F8FF",
                borderRadius: "5px",
                backgroundColor: "#F8F8FF",
              }}>
                <h1 className="d-flex justify-content-center">{selectedMenu.name}</h1>
              </div>
              <div className="d-flex align-items-start flex-column mb-3" style={{
                padding: "30px",
                border: "1px solid #FFFFF0",
                borderRadius: "5px",
                backgroundColor: "#FFFFF0",
                height: "80%"
              }}>
                <h4 className="d-flex justify-content-end">{selectedMenu.summary}</h4>
                <p className="d-flex justify-content-end">{selectedMenu.description}</p>
                <h1 className="d-flex justify-content-end mt-auto p-2 ms-auto">
                  {selectedMenu.price}원
                </h1>
              </div>
            </Col>
          </Row>
          <Row>
            <br />
            <div style={{
              padding: "30px",
              border: "1px solid #FFFFFF",
              borderRadius: "5px",
              backgroundColor: "#FFFFFF"
            }}>
            </div>
            <h2>포장지 옵션</h2>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.self.map(item => (
                <Col key={item.code_id}>
                  <Card className="me-3">
                    <Card.Img variant="top" src={"/images/" + item.code_img} style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check
                          inline
                          label={arrangeItemName(item)}
                          type="radio"
                          name="group1"
                          value={item.code_id}
                          onChange={(e) => {
                            setWrap(e.target.value);
                          }}
                        />
                        <p className="d-flex justify-content-center" style={{ backgroundColor: "#FFCCFF", marginLeft: "110px" }}>{arrangeItemPrice(item)}</p>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Row>
          <div style={{
            padding: "30px",
            border: "1px solid #FFFFFF",
            borderRadius: "5px",
            backgroundColor: "#FFFFFF"
          }}>

          </div>
          <Row>
            <h2>기타 옵션</h2>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.etc.map(item => (
                <Col key={item.code_id}>
                  <Card className="me-3">
                    <Card.Img variant="top" src={"/images/" + item.code_img} style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check
                          inline
                          label={arrangeItemName(item)}
                          type="checkbox"
                          checked={checked[item.code_id] || false}
                          onChange={(e) => handleChange(e, item)}
                        />
                        <p className="d-flex justify-content-center" style={{ backgroundColor: "#FFCCFF", marginLeft: "110px" }}>{arrangeItemPrice(item)}</p>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Row>
          <div style={{
            padding: "30px",
            border: "1px solid #FFFFFF",
            borderRadius: "5px",
            backgroundColor: "#FFFFFF"
          }}>

          </div>
          <Row className="mt-3">
            <h2>포장 옵션</h2>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.bag.map(item => (
                <Col key={item.code_id}>
                  <Card className="me-3">
                    <Card.Img variant="top" src={"/images/" + item.code_img} style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check
                          inline
                          label={arrangeItemName(item)}
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
                        />
                        <p className="d-flex justify-content-center" style={{ backgroundColor: "#FFCCFF", marginLeft: "110px" }}>{arrangeItemPrice(item)}</p>
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
