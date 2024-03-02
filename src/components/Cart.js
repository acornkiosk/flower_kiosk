import { Button, Col, Container, Row } from "react-bootstrap"
import { useSelector } from "react-redux"
import CartRow from "./CartRow"

export default function Cart() {
  const orders = useSelector(state => state.orders)
  return (
    <>
      <Container className="border border-5 rounded " style={{ width: '100%', height: '100%', maxHeight:'400px'}}>
        <Row>
          <Col md={8} className="border border-1 rounded mt-2 mb-2" style={{ overflow: 'auto', maxHeight: '350px' }}>
            {orders.map(item => 
              <CartRow item={item}/>  
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
             <Button size="lg">결제하기</Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}