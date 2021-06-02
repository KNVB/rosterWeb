import {Col,Container,Row} from 'react-bootstrap';
import ITOManagementPanel from './ITOManagementPanel';
export default function ITOManagment(props){
    return(
        <Container>
            <Row>
                <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                    <u>ITO Management Panel</u>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12} sm={12} xl={12} xs={12} className="d-flex flex-column flex-grow-1 justify-content-center">
                    <ITOManagementPanel/>
                </Col>
            </Row>    
        </Container>
    )
}