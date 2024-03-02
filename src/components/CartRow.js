import { Button, Col, Row } from "react-bootstrap"
import { DashSquare, PlusSquare, XSquareFill } from "react-bootstrap-icons"
import { useDispatch, useSelector } from "react-redux"

export default function CartRow(props) {
  const commonTable = useSelector(state => state.commonTable)
  const orders = useSelector(state => state.orders)
  const dispatch = useDispatch()
  const { item } = props
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
  const minus = () =>{
    if (item.menu_count === 1) return
    const newOrders = orders.map(tmp => {
      if (tmp.id === item.id) {
        tmp.menu_count--
      }
      return tmp
    })
    updateOrders(newOrders)
  }
  //options 이름으로 변경 기능
  const convertOptions = () => {
    let result = ""
    let list = item.options.replace(" ","").split(",")
    list.forEach(option => {
      commonTable.forEach(common => {
        if(parseInt(option) === common.code_id){
          result += common.code_name + " "
        }
      })
    })
    return result
  }

  return (
    <>
      <Row className="border-bottom">
        <Col md={1} className="mt-1 md-1">
          <Button variant="secodary" onClick={deleteItem}><XSquareFill /></Button>
        </Col>
        <Col md={5} className="mt-1 mb-1 d-flex align-items-center">{item.menu_name} {convertOptions()}</Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center"><Button variant="warning" onClick={minus}><DashSquare /></Button></Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center">{item.menu_count}개</Col>
        <Col md={1} className="mt-1 mb-1 d-flex align-items-center"><Button variant="warning" onClick={plus}><PlusSquare /></Button></Col>
        <Col md={3} className="mt-1 mb-1 d-flex align-items-center justify-content-end">{item.menu_price * item.menu_count}원</Col>
      </Row>
    </>
  )
}