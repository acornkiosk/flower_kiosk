import Cart from "../components/Cart";
import HeaderImg from "../components/HeaderImg";
import Menu from "../components/Menu";

export default function Main(props) {
  const {setCompleted} = props
  return (
    <div>
      <HeaderImg/>
      <Menu/>
      <Cart setCompleted={setCompleted}/>
    </div>
  )
}