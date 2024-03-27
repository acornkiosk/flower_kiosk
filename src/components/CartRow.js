import { useEffect, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import { DashSquare, PlusSquare, XSquareFill } from "react-bootstrap-icons"
import { useDispatch, useSelector } from "react-redux"

export default function CartRow(props) {
  const commonTable = useSelector(state => state.commonTable)
  const orders = useSelector(state => state.orders)
  const dispatch = useDispatch()
  const { item } = props
  //옵션들의 가격을 저장하는 state
  const [optionPrice, setOptionPrice] = useState(0);
  const [optionTitle, setOptionTitle] = useState(item.menu_name);
  const updateOrders = (newOrders) => {
    const action = {
      type: "UPDATE_ORDERS",
      payload: newOrders
    }
    dispatch(action)
  }
  //아이템 삭제 기능
  const deleteItem = () => {
    const newOrders = orders.filter(tmp => tmp.id !== item.id)
    updateOrders(newOrders)
  }
  //아이템 개수 증가 기능
  const plus = () => {
    if (item.menu_count > 8) return
    const newOrders = orders.map(tmp => {
      if (tmp.id === item.id) {
        tmp.menu_count++
      }
      return tmp
    })
    updateOrders(newOrders)
  }
  //아이템 개수 감소 기능
  const minus = () => {
    if (item.menu_count === 1) return
    const newOrders = orders.map(tmp => {
      if (tmp.id === item.id) {
        tmp.menu_count--
      }
      return tmp
    })
    updateOrders(newOrders)
  }
  useEffect(() => {
    let result = ""
    let list = item.options.replace(" ", "").split(",")
    let price = 0
    let defaultBag = 2019
    list.forEach(option => {
      commonTable.forEach(common => {
        if (parseInt(option) === common.code_id) {
          if (parseInt(defaultBag) !== common.code_id) {
            result += "+" + common.code_name
          }
          price += parseInt(common.code_value)
        }
      })
    })
    if (optionPrice !== price) {
      setOptionPrice(price)
    }
    setOptionTitle(result);
  }, [optionPrice, commonTable, item.options]);

  const sum = (item.menu_price + optionPrice) * item.menu_count;

  return (
    <>
      <Row className="border-bottom" style={{ fontFamily: "Chanssam" }}>
        <Col md={1} className="mt-1 md-1" style={{ fontFamily: "Chanssam" }}>
          <Button variant="secondary" onClick={deleteItem}><XSquareFill /></Button>
        </Col>
        <Col md={5} className="mt-1 mb-1 d-flex align-items-center" style={{ fontFamily: "Chanssam" }}>{item.menu_name} {optionTitle}</Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center" style={{ fontFamily: "Chanssam" }}><Button variant="warning" onClick={minus}><DashSquare /></Button></Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center" style={{ fontFamily: "Chanssam" }}>{item.menu_count}개</Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center" style={{ fontFamily: "Chanssam" }}><Button variant="warning" onClick={plus}><PlusSquare /></Button></Col>
        <Col md={3} className="mt-1 mb-1 d-flex align-items-center justify-content-end" style={{ fontFamily: "Chanssam" }} >{sum}원</Col>
      </Row>
    </>
  )
}