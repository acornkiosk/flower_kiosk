import Cart from "../components/Cart";
import HeaderImg from "../components/HeaderImg";
import Menu from "../components/Menu";
import InfoModal from "../pages/InfoModal";


export default function Main(props) {
  /** App.js <--> Main.js <--> Cart.js */
  /** App.js <--> Main.js <--> InfoModal.js */
  const {setCompleted} = props
  const {setIsInfo} = props
  const {setLogin} = props
  const {setWsReConnect} = props
  return (
    <div>
      <HeaderImg/>
      <Menu/>
      <Cart setCompleted={setCompleted} setLogin={setLogin} setWsReConnect={setWsReConnect}/>
      <InfoModal setIsInfo={setIsInfo} setLogin={setLogin} setWsReConnect={setWsReConnect}/>
    </div>
  )
}