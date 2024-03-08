import { Button, Col, Container, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import CartRow from "./CartRow"
import axios from "axios"
import { useEffect } from "react"

export default function Cart(props) {
  const orders = useSelector(state => state.orders)
  const { setCompleted } = props
  const dispatch = useDispatch()

  const ws = new WebSocket("ws://localhost:9000/flower/ws/order")
  /** 웹소켓 연결관리 함수 */
  const connect = () => {
    /** 연결에 성공했을 경우 동작하는 메서드 */
    ws.onopen = () => { console.log("키오스크 : 실시간 화면연동 시작(웹소켓)") }
    /** 연결과정에서 에러가 생겼을 때 동작하는 메서드 */
    ws.onerror = () => { alert("키오스크 : 화면 연동이 원활하게 이루어지지 않고 있습니다. 서버 확인이 필요합니다(웹소켓)") }
    /** 연결을 종료하고 싶을 때 동작하는 메서드 */
    ws.onclose = () => { console.log("키오스크 : 실시간 화면연동 종료(웹소켓)") }
  }

  const send = (dto) => {
    /** 연습 : 웹소켓에 보내게 될 정보들 */
    var info = {
      type: "ORDER_NEW",
      id: dto.id,
      is_completed: dto.is_completed,
      kiosk_id: dto.kiosk_id,
      menu_count: dto.menu_count,
      menu_name: dto.menu_name,
      menu_price: dto.menu_price,
      options: dto.option,
      order_id: dto.order_id,
      regdate: dto.regdate
    };
    /** 전송 */
    ws.send(JSON.stringify(info))

    /** 리팩토링 대상 코드입니다.
     * 현재 코드 : 단순히 연습코드를 통해 인지를 위한 신호용도로 사용중, flower_front 에서 받으면 refresh 함수를 실행하여 api 로 요청중
     * 예정 : 서버로부터 이곳에 "/api/order/list" 을 요청하고 list 로 담은 다음에 ws.send() 할수로 보내보도록 하자. */
  }

  useEffect(() => {
    /** 처음 주문 창에 들어오게되면 웹소켓에 연결을 시켜준다 */
    connect()
  }, [])

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
      })
      .catch(error => console.log(error))
  }

  const updateDB = (list) => {
    list.forEach(item => {
      axios.post("/api/order", item)
        .then(res => {
          console.log("주문하기 결과 : " + res.data.status)
          console.log(res.data)
          /** 웹소켓 전송 시작시점 */
          send(res.data.dto)
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
              <Col>
                <Button className="w-100 h-100">전체<br />삭제</Button>
              </Col>
            </Row>
            <Row className="mt-2" style={{ flex: '2' }}>
              <Col><h3 className="text-center">선택한 상품</h3></Col>
              <Col><h3><span style={{ color: "red" }}>6</span>개</h3></Col>
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