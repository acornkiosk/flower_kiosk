import axios from "axios"
import { useRef, useState } from "react"
import { Alert, Button, Col, Container, Image, Row } from "react-bootstrap"
import { BackspaceFill, DashSquare, Icon0Square, Icon1Square, Icon2Square, Icon3Square, Icon4Square, Icon5Square, Icon6Square, Icon7Square, Icon8Square, Icon9Square } from "react-bootstrap-icons"
import { useDispatch } from "react-redux"
import connect from "../websocket/WebSocket"

export default function KioskLogin(props) {
  const [num, setNum] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const dispatch = useDispatch()
  const { setIsInfo, setLogin } = props
  //웹소켓을 담을 변수 초기화
  let ws = useRef(null)
  //로그인 버튼을 누를시 실제 Db에 있는 값을 비교
  const login = () => {
    let id = parseInt(num)
    axios.post("/api/kiosk/get", { id: id })
      .then(res => {
        if (res.data.dto.id === id) {
          /** 전원 여부 확인하기 */
          let kiostPower = res.data.dto.power
          if (kiostPower === "off") {
            /** 접근불가 모달 띄우기 */
            setIsInfo(true)
          } else {
            /** 웹소켓 open */
            connect(ws, res.data.dto.id)
            /** 접근불가 모달 닫기 */
            setIsInfo(false)
            /** 로그인 성공신호 전달 */
            setLogin(true)
            /** store 작업 */
            const data = { 
              kiosk:res.data.dto.id
              , websocket: ws 
            }
            dispatch({ type: "SET_KIOSK", payload: data })
          }
        } else {
          setShowAlert(true)
        }
      })
      .catch(() => { setShowAlert(true) })
  }
  return (
    <Container>
      <Image fluid src="/images/kiosk_header.png" style={{ width: '100%', maxHeight: '400px' }} />
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '1200px' }}>
        <h1 className="mb-5 border-bottom text-center" style={{ minWidth: '40%' }}>{num}</h1>
        {showAlert && <Alert className="text-center" variant="danger" style={{ minWidth: '40%' }}>키오스크 아이디를 다시 입력해주세요!</Alert>}
        <Button className="mb-5" size="lg" style={{ width: '40%', height: '10%' }} onClick={login}>로그인</Button>
        <KeyPad setNum={setNum} num={num} />
      </Container>
    </Container>
  )
}

function KeyPad(props) {
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