export default function Connect(ws, id) {
    /** 최초 연결 후 동작 */
    function connectWebSocket() {
        /** 실제서버용 요청링크 */
        ws.current = new WebSocket("ws://flower.onleave.co.kr:9000/flower/ws/kiosk/" + id)
        /** 최초 연결 후 동작 */
        ws.current.onopen = () => {
            console.log(socketState(ws.current.readyState))
        }
        /** 연결 후 사용중에 에러! */
        ws.current.onerror = (e) => {
            console.log(socketState(ws.current.readyState))
        }
        /** 닫힌 이후의 로직 */
        ws.current.onclose = (e) => {
            /** 웹소켓 종료 이후 서버로부터 전달받은 메시지 */
            if (e.code !== 1000 && !e.wasClean) {
                /** 에러 정보 공유 */
                console.log(e.code, e.reason)
                /** 현재 웹소켓 세션을 제거. */
                ws.current = null;
                /** 새로운 웹소켓 생성 */
                connectWebSocket();
            }
            console.log("끊긴 웹소켓 세션 삭제여부: " + e.wasClean)
        }
    }
    /** 최초 웹소켓 연결 함수 호출 */
    connectWebSocket();
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
        /** Cart.js 에서 시작하는 주문접수 신호 */
        let info = { type: "UPDATE_ORDERS" }
        let toast = { type: "SET_TOAST" }
        ws.current.send(JSON.stringify(info))
        ws.current.send(JSON.stringify(toast))
    }
}
function kioskPower(ws, callback) {
    if (ws.current) {
        ws.current.onmessage = (msg) => {
            let result = JSON.parse(msg.data);
            callback(result)
        }
    }
}
// 반환할 값을 정의한다(변수명)
export { close, kioskPower, send }
/** 웹소켓 커넥트 상태메시지 */
function socketState(msg) {
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