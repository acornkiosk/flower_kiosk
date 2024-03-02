import { useEffect, useState } from "react"
import { Container, Row, Tab, Tabs } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"

export default function Menu() {
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

  return (
    <div>
      <Tabs defaultActiveKey="All" className="mb-3" fill>
        <Tab eventKey="All" title="All">
          <div className="album py-5 ">
            <Container>
              <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {/* <Menu category={0} id={id} setId={setId} /> */}
              </Row>
            </Container>
          </div>
        </Tab>
        {category.map(item =>
          <Tab eventKey={item.code_id} title={item.code_name}>
            <div className="album py-5">
              <Container>
                <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  <Menu category={item.code_id} id={id} setId={setId} />
                </Row>
              </Container>
            </div>
          </Tab>
        )}
      </Tabs>
    </div>
  )
}