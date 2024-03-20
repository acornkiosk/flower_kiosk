
export default function connect(ws, id) {
    /** localhost용 요청링크 */
    ws.current = new WebSocket("ws://localhost:9000/flower/ws/kiosk/" + id)
    /** 실제서버용 요청링크 */
    //WS = new WebSocket("ws://flower.onleave.co.kr:9000/flower/ws/kiosk/" + id)

    /** 최초 연결 후 동작 */
    ws.current.onopen = () => { console.log(socketState(ws.current.readyState)) }
    /** 연결 후 사용중에 에러! */
    ws.current.onerror = (e) => {
        console.log(e)
        console.log(socketState(ws.current.readyState))
    }
    /** 닫힌 이후의 로직 */
    ws.current.onclose = (e) => {
        /** 서버로부터 종료된 사유를 읽어오는 명령어 */
        let reason = getCloseEventCodeReason(e.code)
        console.log(e.code, reason)
    }
    /**
     * WebSocket close 와 onclose 의 차이와 사용법
     * 
     * code : 커넥션을 닫을 때 사용하는 특수 코드
     * reason : 커넥션 닫기 사유를 설명하는 문자열
     *
     * close 
     * 작성법 : WebSocket.close(code, reason);
     * 의미 : 사유를 지정하여 직접 웹소켓 종료시키기
     * 
     * onclose
     * 작성법 : WebSocket.close = () => { 명령할 함수 작성 }
     * 의미 : 종료될 경우 함수 실행
     */

}
function close(ws, msg) {
    /** undefined 에러 방지 */
    if (ws.current) {
        ws.current.close(1000, msg)
        console.log(socketState(ws.current.readyState))
    }
}
function send(ws) {
    if (ws.current) {
        /** Cart.js */
        let info = { type: "UPDATE_ORDERS" }
        let toast = { type: "SET_TOAST" }
        ws.current.send(JSON.stringify(info))
        ws.current.send(JSON.stringify(toast))
        console.log("주문접수")
    }
}
let result
function kioskPower(ws){
    if(ws.current){
        ws.current.onmessage = (msg) => {
            result = JSON.parse(msg.data);
        }
    }
}
// 반환할 값을 정의한다(변수명)
export { send, close, kioskPower, result}

/** 웹소켓 커넥트 상태메시지 */
function socketState(msg) {
    // eslint-disable-next-line default-case
    switch (msg) {
        case 0: {
            return "'CONNECTING': 손님 키오스크 웹소켓 연결시도"
        }
        case 1: {
            return "'OPEN': 손님 키오스크 웹소켓 통신시작"
        }
        case 2: {
            return "'CLOSING': 손님 키오스크 웹소켓 커넥션 종료 중"
        }
        case 3: {
            return "'CLOSED': 손님 키오스크 웹소켓 커넥션이 종료됨"
        }
    }
}
/** 웹소켓 에러코드 */
function getCloseEventCodeReason(event) {

    /*
     * WebSocket.close(code, reason);
     * code : 커넥션을 닫을 때 사용하는 특수 코드
     * reason : 커넥션 닫기 사유를 설명하는 문자열
     */

    // eslint-disable-next-line default-case
    switch (event) {
        case 1000: { return "로그아웃 하셨습니다." }
        case 1001: { return "서버 혹은 웹브라우저를 이탈 하셨습니다." }
        case 1002: { return "프로토콜 오류" }
        case 1003: { return "허용되지 않은 데이터 유형을 수신하여 종료합니다." }
        case 1005: { return "상태 코드가 없는 채로 종료되었습니다." }
        case 1006: { return "close 명령없이 비정상적으로 종료되었습니다." }
        case 1007: { return "서버에 설정한 엔드포인트(config) 내에서 일치하지 않은 데이터를 받았습니다." }
        case 1008: { return "정책위반 짜샤" }
        case 1009: { return "메시지 처리 용량 초과되었습니다." }
        case 1010: { return "웹소켓 핸드세이크의 응답 메시지에서 데이터를 반환하지 못했습니다." }
        case 1011: { return "서버가 요청을 완료하는데 방해가 되는 예기치 않은 상황에 직면하여 연결을 종료합니다." }
        case 1015: { return "TLS 핸드세이크 수행 실패(인증서 검증불가" }
    }
}