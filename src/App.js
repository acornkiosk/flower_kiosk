import { useState } from 'react';
import './App.css';
import KioskLogin from './pages/KioskLogin';

function App() {
  //로그인을 먼저 해야함
  const [isLogin, setLogin] = useState(false)
  return (
    <div>  
        {!isLogin && <KioskLogin isLogin={isLogin} setLogin={setLogin} />}
    </div>
  )
}

export default App;
