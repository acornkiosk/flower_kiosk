import { Button, Col, Container, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import CartRow from "./CartRow"
import axios from "axios"

export default function Cart(props) {
  const orders = useSelector(state => state.orders)
  const {setCompleted} = props
  const dispatch = useDispatch()
  const pay = () => {
    axios.get("/api/order/cartId")
    .then(res => {
      //주문 번호
      const order_id = res.data.dto.order_id
      dispatch({type: "UPDATE_ORDER_ID", payload: order_id})
      const newList = orders.map(item => {
        item.order_id = order_id
        return item
      })
      updateDB(newList)
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