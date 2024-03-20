import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from "react-redux"
import { createRef } from "react"
import { close }from "../websocket/WebSocket"

/** 안내 메시지 */
function InfoModal(props) {
  /** Cart.js 와 App.js 모두 연결 */
  const { setIsInfo, setLogin } = props
  let ws = useSelector(state => state.ws)
  const dispatch = useDispatch()
  return (
    <Modal
      {...props}
      show={props.show}
      setLogin={props.setLogin}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title >확인!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>점검중인 키오스크입니다.</h4>
        <p>키오스크 관리정보를 확인하시기 바랍니다.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={() => {
          setIsInfo(false)
          setLogin(false)
          /** 웹소켓 close */
          if(ws!=null) close(ws, "웹소켓 종료")
          /** store 작업 */
          const data = { kiosk: null, ws: createRef() }
          dispatch({ type: "SET_KIOSK", payload: data })
        }}>로그아웃</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InfoModal