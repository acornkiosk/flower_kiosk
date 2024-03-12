import { Image, Container } from "react-bootstrap";

export default function Welcome(props) {
    const {setWelcome} = props
    
    return (
        <>
            <Container className="text-center" onClick={() => {
                setWelcome(true)
                console.log(123)
            }}>
                <Image src="/images/cover.png" class="img-fluid" />
            </Container>
        </>
    )
}