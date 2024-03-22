
/** 컴포넌트가 아니기에 useDispatch, useSelector, useRef, useEffect 모두 사용불가 */
export default function Connect(ws, id) {
    /** 최초 연결 후 동작 */
    function connectWebSocket() {
        /** localhost용 요청링크 */
        ws.current = new WebSocket("ws://flower.onleave.co.kr:9000/flower/ws/kiosk/" + id)
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
    /** 최초 웹소켓 연결 함수 호출 */
    connectWebSocket();
}
function close(ws, msg) {
    /** undefined 에러 방지 */
    if (ws.current) {
        ws.current.close(1000, msg)
        console.log(socketState(ws.current.readyState))
        /*
         * WebSocket.close(code, reason);
         * code : 커넥션을 닫을 때 사용하는 특수 코드
         * reason : 커넥션 닫기 사유를 설명하는 문자열
         */
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
export { send, close, kioskPower }

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