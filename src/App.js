import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import Complete from './components/Complete';
import KioskLogin from './pages/KioskLogin';
import Main from './pages/Main';
import Welcome from './pages/Welcome';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    axios.post("/api/common/child", { code_id: 0 })
      .then(res => {
        dispatch({ type: "UPDATE_COMMON", payload: res.data.list })
      })
      .catch(error => console.log(error))
    axios.post("api/menu/list", { category_id: 0 })
      .then(res => {
        dispatch({ type: "GET_MENU", payload: res.data.list })
      })
      .catch(error => console.log(error))
  }, [])
  //로그인을 먼저 해야함
  const [isLogin, setLogin] = useState(false)
  const [isCompleted, setCompleted] = useState(false)
  const [isWelcome, setWelcome] = useState(false)
  return (
    <div>
      {!isLogin && <KioskLogin isLogin={isLogin} setLogin={setLogin} />}
      {/** 다른 컴포넌트에서 로그아웃한 이력을 가져오기 위해 isLogin과 setLogin을 넣음 */}
      {isLogin && !isWelcome && <Welcome setWelcome={setWelcome}/>}
      {isLogin && !isCompleted && isWelcome && <Main isLogin={isLogin} setLogin={setLogin} setCompleted={setCompleted} />}
      {isCompleted && <Complete setCompleted={setCompleted} />}
    </div>
  )
}

export default App;
