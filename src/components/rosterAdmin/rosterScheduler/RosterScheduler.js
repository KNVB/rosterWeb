import React from 'react';
import {Col,Container,Row} from 'react-bootstrap';
function RosterScheduler(){
    return (
        <div className="App p-1">
            <Container fluid={true} className="tableContainer">
                <Row>
                    <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <u>EMSTF Resident Support & Computer Operation Support Services Team Roster</u>
                    </Col>
                </Row>
            </Container>
        </div>        
    )
}
export default RosterScheduler