import Cart from "../components/Cart";
import HeaderImg from "../components/HeaderImg";
import InfoModal from "../components/InfoModal";
import Menu from "../components/Menu";

export default function Main(props) {
  /** App.js <--> Main.js <--> Cart.js */
  /** App.js <--> Main.js <--> InfoModal.js */
  const {setCompleted, setIsInfo, setLogin, setWsReConnect} = props
  return (
    <div>
      <HeaderImg/>
      <Menu/>
      <Cart setCompleted={setCompleted} setLogin={setLogin} setWsReConnect={setWsReConnect}/>
      <InfoModal setIsInfo={setIsInfo} setLogin={setLogin} setWsReConnect={setWsReConnect}/>
    </div>
  )
}