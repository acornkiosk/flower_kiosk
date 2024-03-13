import { Button, Container, Row } from "react-bootstrap";
import HeaderImg from "./HeaderImg";
import { useSelector } from "react-redux";

export default function Complete(props) {
  const {setCompleted} = props
  const order_id = useSelector(state => state.order_id)
  return (
    <Container style={{ fontFamily: "Chanssam" }}>
      <HeaderImg />
      <h1 className="d-flex flex-column align-items-center justify-content-center text-center" style={{height:"400px"}}>{order_id} 번 고객님 <br /> 주문이 완료 되었습니다</h1>
      <Row>
        <Button size="lg" onClick={() =>{setCompleted(false)}}>주문 하러가기</Button>
      </Row>

    </Container>
  )
}