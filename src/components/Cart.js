import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import CartRow from "./CartRow"
import InfoModal from "./InfoModal"
import { convertOptionsIntoPrice } from "./util"
import { send, kioskPower } from "../websocket/WebSocket"

export default function Cart(props) {
  /** InfoModal.js로 로그아웃한 이력을 가져가기 위함 */
  const { setLogin, setCompleted } = props
  const orders = useSelector(state => state.orders)
  const id = useSelector(state => state.kiosk)
  const dispatch = useDispatch()
  const [isInfo, setIsInfo] = useState(false);
  const commonTable = useSelector(state => state.commonTable)
  const [sum, setSum] = useState(0)
  let ws = useSelector(state => state.ws)

  /** 키오스크 정보 axios */
  // function getKiosk() {
  //   axios.post("/api/kiosk/get", { id: id.kiosk }) // id = {kiosk: number}
  //     .then(res => {
  //       if (res.data.dto.power === "off") {
  //         setIsInfo(true)
  //       } else {
  //         setIsInfo(false)
  //       }
  //     })
  //     .catch(error => console.log(error))
  // }

  /** 컴포넌트 호출시 */
  useEffect(() => {
    /** WebSocket.js */
    kioskPower(ws, (result) => {
      if (result.type === "SET_KIOSK") {
        console.log(result.type)
      }
    })
  }, [ws])
  const pay = () => {
    axios.get("/api/order/cartId")
      .then(res => {
        /** 주문 번호 : 서버에서 시퀀스 cart 번호를 가져온다. */
        const order_id = res.data.dto.order_id
        dispatch({ type: "UPDATE_ORDER_ID", payload: order_id })
        /** MenuItem 에서 처리한 orders(order type list) 안에 'order_id' 값을 넣는 작업 */
        const newList = orders.map(item => {
          item.order_id = order_id
          return item
        })
        /** 서버로 주문정보 전송 */
        updateDB(newList)
        /** 주문을 성공적으로 마쳤다는 사실을 고객님께 알리기  */
        setCompleted(true)
        /** 웹소켓으로 접수신호 전달하기 */
        send(ws)
      })
      .catch(error => console.log(error))
  }
  const updateDB = (list) => {
    list.forEach(item => {
      item.kiosk_id = id.kiosk // id = {kiosk: number} : 사장님 주문관리 페이지 오류 원인
      axios.post("/api/order", item)
        .then(res => {
          console.log("주문하기 결과 : " + res.data.status)
        })
        .catch(erorr => console.log(erorr))
    })
  }
  //카트 전체 삭제
  const DeleteCart = () => {
    dispatch({
      type: "UPDATE_ORDERS",
      payload: []
    })
  }

  useEffect(() => {

    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      const optionPrice = convertOptionsIntoPrice(orders[i].options, commonTable);
      total += (orders[i].menu_price + optionPrice) * orders[i].menu_count;
    }
    setSum(total);
  }, [orders])

  return (
    <>
      {isInfo && <InfoModal show={isInfo} setIsInfo={setIsInfo} setLogin={setLogin} />}
      <Container className="border border-5 rounded " style={{ width: '100%', height: '100%', maxHeight: '400px' }}>
        <Row>
          <Col md={8} className="border border-1 rounded mt-2 mb-2" style={{ overflow: 'auto', maxHeight: '350px' }}>
            {orders.map(item =>

              <div key={item.id}>
                <CartRow item={item} />
              </div>
            )}
          </Col>
          <Col md={4} className="mb-2 d-flex flex-column" style={{ height: '350px' }}>
            <Row className="mt-2" style={{ flex: '2' }}>
              <Button className="w-100 h-100" style={{ fontSize: 32, fontFamily: "Chanssam" }} onClick={DeleteCart}>전체삭제</Button>
            </Row>
            <Row className="mt-2" style={{ flex: '2' }}>
              <Col>
                <Col><h3 className="text-center" style={{ fontFamily: "Chanssam" }}>선택한 상품 <span style={{ fontFamily: "Chanssam", color: "red" }}>{orders.length}</span>개</h3></Col>
                <Col><h3 className="text-center" style={{ fontFamily: "Chanssam" }}>주문 금액<span style={{ fontFamily: "Chanssam", color: "red" }}>{sum}</span>원</h3></Col>
              </Col>
            </Row>
            <Row className="mt-2" style={{ flex: '5' }}>
              <Button onClick={pay} disabled={orders.length === 0} style={{ fontSize: 43, fontFamily: "Chanssam" }}>결제하기 </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}