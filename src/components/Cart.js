import { Button, Col, Container, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import CartRow from "./CartRow"
import axios from "axios"
import { useEffect } from "react"

export default function Cart(props) {
  const orders = useSelector(state => state.orders)
  const {setCompleted} = props
  const dispatch = useDispatch()

  // const ws = new WebSocket("ws://localhost:9000/flower/ws/order")
  
  // /** 웹소켓 연결관리 함수 */
  // const connect = () => {
  //   /** 연결에 성공했을 경우 동작하는 메서드 */
  //   ws.onopen = (e) => {
  //     console.log("키오스크 : 실시간 화면연동 시작(웹소켓)")
  //   }
  //   /** 연결과정에서 에러가 생겼을 때 동작하는 메서드 */
  //   ws.onerror = (e) => {
  //     alert("키오스크 : 화면 연동이 원활하게 이루어지지 않고 있습니다. 서버 확인이 필요합니다(웹소켓)")
  //   }
  //   /** 연결을 종료하고 싶을 때 동작하는 메서드 */
  //   ws.onclose = (e) => {
  //     console.log("키오스크 : 실시간 화면연동 종료(웹소켓)")
  //   }
  // }
  
  // const send = () => {
  //   ws.send("보냄")
  // }
  useEffect(() =>{
    /** 처음 주문 창에 들어오게되면 웹소켓에 연결을 시켜준다 */
    // connect()
  },[])

  const pay = () => {
    axios.get("/api/order/cartId")
    .then(res => {
      /** 주문 번호 : 서버에서 시퀀스 cart 번호를 가져온다. */ 
      const order_id = res.data.dto.order_id
      dispatch({type: "UPDATE_ORDER_ID", payload: order_id})
      /** MenuItem 에서 처리한 orders(order type list) 안에 'order_id' 값을 넣는 작업 */
      const newList = orders.map(item => {
        item.order_id = order_id
        return item
      })
      /** 서버로 주문정보 전송 */
      updateDB(newList)
      /** 관리자 클라이어언트로부터 주문이 완료되었다는 소식이 오는 순간 나오는 알림 메시지 : Complete  */
      setCompleted(true)
    })
    .catch(error => console.log(error))
  }

  const updateDB = (list) => {
    list.forEach(item =>{
      axios.post("/api/order", item)
      .then(res => {
        console.log(res.data)
      })
      .catch(erorr => console.log(erorr))
    })
  }

  return (
    <>
      <Container className="border border-5 rounded " style={{ width: '100%', height: '100%', maxHeight:'400px'}}>
        <Row>
          <Col md={8} className="border border-1 rounded mt-2 mb-2" style={{ overflow: 'auto', maxHeight: '350px' }}>
            {orders.map(item => 
              <div key={item.id}>
                <CartRow item={item}/>  
              </div>
            )}
          </Col>
          <Col md={4} className="mb-2 d-flex flex-column" style={{height:'350px'}}>
            <Row className="mt-2" style={{ flex: '2' }}>
              <Col className="text-center">
                <h3>남은시간</h3>
                <h1 className="text-danger">120초</h1>
              </Col>
              <Col>
                <Button className="w-100 h-100">전체<br/>삭제</Button>
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