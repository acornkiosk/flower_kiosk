import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import CartRow from "./CartRow"
import InfoModal from "./InfoModal"

export default function Cart(props) {
  /** InfoModal.js로 로그아웃한 이력을 가져가기 위함 */
  const { setLogin, setCompleted } = props
  const orders = useSelector(state => state.orders)
  const id = useSelector(state => state.kiosk)
  const dispatch = useDispatch()
  const [isInfo, setIsInfo] = useState(false)
  //키오스크 정보 axios
  function getKiosk() {
    axios.post("/api/kiosk/get", { id: id })
      .then(res => {
        /** 
         * 수정이 필요한 구간
         * 서버에 가져올 때 수정 이전의 값으로 가져와짐(한박자 느림)
         * 그래서 한번 더 요청함
         */
        if (res.data.dto.power === "off") {
          setIsInfo(true)
        } else {
          setIsInfo(false)
        }
      })
      .catch(error => console.log(error))
  }

  /** 
   *  용도: 웹소켓 프로토콜을 사용하여 서버 'WebSocketConfig' 연결
   *  문제: 로그인시 한번에 두개씩 세션이 생성됨 */
  const ws = new WebSocket("ws://localhost:9000/flower/ws/order");
  /** 웹소켓 연결관리 함수 */
  const connect = () => {
    /** 연결에 성공했을 경우 동작하는 메서드 */
    ws.onopen = () => {
      console.log("손님 키오스크 오픈: " + ws.readyState)
      getKiosk()
    }
    /** 연결과정에서 에러가 생겼을 때 동작하는 메서드 */
    ws.onerror = (error) => { console.log("index.js : 웹소켓 에러 "+error) }
    /** 사장님 페이지 키오스크 관리 */
    ws.onmessage = (msg) => {
      if (msg != null) {
        var result = JSON.parse(msg.data);
        if (result.type === "SET_KIOSK") getKiosk()
      }
    }
    /** 커넥션 닫기 요청하는 코드
     * socket.close(code, reason);
     * code : 커넥션을 닫을 때 사용하는 특수 코드
     * reason : 커넥션 닫기 사유를 설명하는 문자열
     */
    /** 커넥션 닫기 응답받는 코드 */
    ws.close = (res) => {
      console.log("웹소켓이 종료되었습니다.")
      console.log("사유코드: "+res.code)
      console.log("사유내용: "+res.reason)
    }
    /**
     * ws.readyState 숫자해석
     * 0 – “CONNECTING”: 웹소켓 연결 중
     * 1 – “OPEN”: 웹소켓 연결이 성립되고 통신 
     * 2 – “CLOSING”: 웹소켓 커넥션 종료 중
     * 3 – “CLOSED”: 웹소켓 커넥션이 종료됨
     */
    console.log("손님 키오스크 : " + ws.readyState)

    return ws
  }
  /** 주문처리될 때 */
  const send = () => {
    if (ws != null) {
      var info = { type: "UPDATE_ORDERS" }
      /** object 를 String 으로 변환 */
      ws.send(JSON.stringify(info))
    } else {
      console.log("손님 키오스크 : ws 값 어디갔냐")
    }
  }
  /** 컴포넌트 호출시 */
  useEffect(() => {
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
        /** 주문정보 완전 업데이트 이후로 웹소켓 요청 */
        send()
      })
      .catch(error => console.log(error))
  }
  const updateDB = (list) => {
    list.forEach(item => {
      axios.post("/api/order", item)
        .then(res => {
          console.log("주문하기 결과 : " + res.data.status)
        })
        .catch(erorr => console.log(erorr))
    })
  }
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