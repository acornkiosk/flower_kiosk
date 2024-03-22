import Cart from "../components/Cart";
import HeaderImg from "../components/HeaderImg";
import InfoModal from "../components/InfoModal";
import Menu from "../components/Menu";
import { kioskPower } from "../websocket/WebSocket"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function Main(props) {
  /** App.js <--> Main.js <--> Cart.js */
  /** App.js <--> Main.js <--> InfoModal.js */
  const {setCompleted, setLogin} = props
  const [isInfo, setIsInfo] = useState(false);
  const id = useSelector(state => state.kiosk); // id = {kiosk: number}
  let ws = useSelector(state => state.ws);

  /** 컴포넌트 호출시 */
  useEffect(() => {
    /** WebSocket.js */
    kioskPower(ws, (result) => {
      if (result.type === "SET_KIOSK" && result.power === "off" && result.kioskID === id.kiosk) {
        setIsInfo(true)
      }else if(result.type === "SET_KIOSK" && result.power === "on" && result.kioskID === id.kiosk) {
        setIsInfo(false)
      }
    })
  }, [ws])
  return (
    <div>
      <HeaderImg/>
      <Menu/>
      <Cart setCompleted={setCompleted} setLogin={setLogin} isInfo={isInfo} setIsInfo={setIsInfo} />
      <InfoModal show={isInfo} setIsInfo={setIsInfo} setLogin={setLogin} />
    </div>
  )
}