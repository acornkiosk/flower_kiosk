import { useEffect, useState } from 'react';
import './App.css';
import KioskLogin from './pages/KioskLogin';
import Main from './container/Main';
import { useDispatch } from 'react-redux';
import axios from 'axios';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    axios.post("/api/common/child", {code_id: 0})
    .then(res =>{
      dispatch({type: "UPDATE_COMMON", payload: res.data.list})
    })
    .catch(error => console.log(error))
  }, [])
  //로그인을 먼저 해야함
  const [isLogin, setLogin] = useState(false)
  return (
    <div>  
        {!isLogin && <KioskLogin isLogin={isLogin} setLogin={setLogin} />}
        {isLogin && <Main/>}
    </div>
  )
}

export default App;
