import { Col, Container, Row } from "react-bootstrap"
import { BackspaceFill, DashSquare, Icon0Square, Icon1Square, Icon2Square, Icon3Square, Icon4Square, Icon5Square, Icon6Square, Icon7Square, Icon8Square, Icon9Square } from "react-bootstrap-icons"
export default function Keypad(props) {
  const click = (item) => {
    let newNum
    if (item === 'x') {
      newNum = props.num.slice(0, -1)
    } else {
      if (props.num.length > 4) return

      newNum = props.num + item
    }

    props.setNum(newNum)
  }
  return (
    <Container className="d-flex justify-content-center flex-column border-top">
      <Row className="mt-5">
        <Col className="text-center"><Icon1Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("1")
        }} /></Col>
        <Col className="text-center"><Icon2Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("2")
        }} /></Col>
        <Col className="text-center"><Icon3Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("3")
        }} /></Col>
      </Row>
      <Row className="mt-5">
        <Col className="text-center"><Icon4Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("4")
        }} /></Col>
        <Col className="text-center"><Icon5Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("5")
        }} /></Col>
        <Col className="text-center"><Icon6Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("6")
        }} /></Col>
      </Row>
      <Row className="mt-5">
        <Col className="text-center"><Icon7Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("7")
        }} /></Col>
        <Col className="text-center"><Icon8Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("8")
        }} /></Col>
        <Col className="text-center"><Icon9Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("9")
        }} /></Col>
      </Row>
      <Row className="mt-5">
        <Col className="text-center"><DashSquare className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("-")
        }} /></Col>
        <Col className="text-center"><Icon0Square className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("0")
        }} /></Col>
        <Col className="text-center"><BackspaceFill className="btn" style={{ width: '128px', height: '128px' }} onClick={() => {
          click("x")
        }} /></Col>
      </Row>
    </Container>
  )
}