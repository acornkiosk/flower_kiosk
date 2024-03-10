import { Button, Col, Container, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import CartRow from "./CartRow"
import axios from "axios"
import { useEffect } from "react"

export default function Cart(props) {
  const orders = useSelector(state => state.orders)
  const { setCompleted } = props
  const dispatch = useDispatch()

/** 웹소켓 참조값을 담을 필드 */
let ws 

/** 웹소켓 연결관리 함수 */
const connect = () => {
  /** 웹소켓 프로토콜을 사용하여 서버 'WebSocketConfig' 연결 */
  ws = new WebSocket("ws://localhost:9000/flower/ws/order")
  /** 연결에 성공했을 경우 동작하는 메서드 */
  ws.onopen = () => { 
    console.log("손님 키오스크(Cart.js) : 실시간 화면연동 시작(웹소켓)") 
    ws.onmessage()
  }
  /** 연결과정에서 에러가 생겼을 때 동작하는 메서드 */
  ws.onerror = () => { 
    console.log("손님 키오스크(Cart.js) : 화면 연동이 원활하게 이루어지지 않고 있습니다. 서버 확인이 필요합니다(웹소켓)")
    /** 연결 다시시도 */
    setTimeout(() => {
      connect()
    }, 5000)
  }
  /** 사장님 키오스크 측에서 off 할 경우? */
  ws.onclose = () => {}

  /** 사장님 페이지 키오스크 관리 */
  ws.onmessage = (msg) => {
    if(msg != null){
      var result = JSON.parse(msg.data);
      if(result.type === "SET_KIOSK"){
        console.log(result.type)
      }
    }else{
      console.log("없엉")
    }
  }
}

useEffect(()=>{
  connect()
})

  const send = (list) => {
    /** 주문이 들어온 소식을 전달하자 */
    console.log(list)
      let info = {
        type: "ORDER_COUNT",
        count:list
      }
     console.log(ws) 
     /** 전송 */
     ws.send(Array.isArray())
  }

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
        /** 웹소켓 전송 시작시점 */
        send(newList)
      })
      .catch(error => console.log(error))
  }

  const updateDB = (list) => {
    list.forEach(item => {
      axios.post("/api/order", item)
        .then(res => {
          console.log("주문하기 결과 : " + res.data.status)
          console.log(res.data)
        })
        .catch(erorr => console.log(erorr))
    })
  }

  return (
    <>
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
              <Col className="text-center">
                <h3>남은시간</h3>
                <h1 className="text-danger">120초</h1>
              </Col>
              <Col>
                <Button className="w-100 h-100">전체<br />삭제</Button>
              </Col>
            </Row>
            <Row className="mt-2" style={{ flex: '3' }}>
              <Button size="lg" disabled className="mb-2">전체 주문 개수</Button>
            </Row>
            <Row style={{ flex: '5' }}>
              <Button size="lg" onClick={pay} disabled={orders.length === 0}>결제하기</Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}