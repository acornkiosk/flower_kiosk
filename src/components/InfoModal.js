import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/** 안내 메시지 */
function InfoModal(props) {
  /** Cart.js 와 App.js 모두 연결 */
  const { setIsInfo, setLogin, show } = props
  return (
    <Modal
      {...props}
      show={show}
      setLogin={setLogin}
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
        }}>로그아웃</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InfoModal