import {Col,Container,Row} from 'react-bootstrap';
export default function ITOManagment(){
    return(
        <div className="App p-1">
            <Container fluid={true} className="tableContainer">
                <Row>
                    <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <u>EMSD ITO Managment</u>
                    </Col>
                </Row>
            </Container>
        </div>        
    )
}