import { Image, Container } from "react-bootstrap";

export default function Welcome(props) {
    const {setWelcome} = props
    
    return (
        <>
            <Container className="text-center" onClick={() => {
                setWelcome(true)
            }}>
                <Image src="/images/cover.png" className="img-fluid" />
            </Container>
        </>
    )
}