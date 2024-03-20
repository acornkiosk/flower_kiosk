import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const initialstate = {
  commonTable: [],
  orders: [],
  kiosk: 0,
  order_id: 0,
  menu: []
}
const reducer = (state = initialstate, action) => {
  let newState
  if (action.type === "SET_KIOSK") {
    newState = {
      ...state,
      kiosk: action.payload
    }
  } else if (action.type === "UPDATE_COMMON") {
    newState = {
      ...state,
      commonTable: action.payload
    }
  } else if (action.type === "UPDATE_ORDERS") {
    newState = {
      ...state,
      orders: action.payload
    }
  } else if (action.type === "UPDATE_ORDER_ID") {
    newState = {
      ...state,
      order_id: action.payload
    }
  } else if (action.type === "GET_MENU") {
    newState = {
      ...state,
      menu: action.payload
    }
  } else {
    newState = state
  }
  return newState
}
const store = createStore(reducer)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
