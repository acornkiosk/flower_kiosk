import { useEffect, useState } from "react"
import { Container, Row, Tab, Tabs } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import MenuItem from "./MenuItem"

export default function Menu() {
  const menu = useSelector(state => state.menu)
  const commonTable = useSelector((state) => state.commonTable)
  const [category, setCategory] = useState([])
  const dispatch = useDispatch()
  //주문 구별을 위한 id 
  const [id, setId] = useState(1)
  //처음 컴포넌트 실행시 category 가져오기
  useEffect(() => {
    let list = []
    commonTable.forEach(item => {
      if (item.p_code_id === 1000) {
        list.push(item)
      }
    })
    setCategory(list)
    return () =>{
      //dispatch를 통해 장바구니 초기화 
      dispatch({type:"UPDATE_ORDERS", payload: []})
    }
  }, [])
  //메뉴 분류 
  const categorize = (category_id) => {
    if(category_id === 0) return menu

    if(category_id === 1001) {
      return menu.filter(item => item.category_id === 1001)
    }

    if(category_id === 1002) {
      return menu.filter(item => item.category_id === 1002)
    }

    if(category_id === 1003) {
      return menu.filter(item => item.category_id === 1003)
    }
  }
  return (
    <div style={{ fontFamily: "Chanssam" }}>
      <Tabs defaultActiveKey="All" className="nav nav-actives mb-3" style={{fontSize: "25px", backgroundColor:"#FFFFCC"}} fill>
        <Tab eventKey="All" title="All">
          <div className="album py-5 ">
            <Container>
              <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <MenuItem id={id} setId={setId} menu={menu} />
              </Row>
            </Container>
          </div>
        </Tab>
        {category.map(item =>
          <Tab eventKey={item.code_id} title={item.code_name} key={item.code_id}>
            <div className="album py-5">
              <Container>
                <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  <MenuItem menu={categorize(item.code_id)} id={id} setId={setId} />
                </Row>
              </Container>
            </div>
          </Tab>
        )}
      </Tabs>
      <style>
        {`
          .nav-link {
            color: black !important;
          }
        `}
      </style>
    </div>
  )
}