import "./ButtonPanel.css";
import {Col,Container,Row} from 'react-bootstrap';

export default function ButtonPanel(){
    
    return(
        <Container fluid={true}>
            <Row>
                <Col md={12} lg={12} sm={12} xl={12} xs={12} className="d-flex justify-content-around">
                    <div className="findDuplicateShiftButton">
                        Find Duplicate Shift
                    </div>
                    <div className="checkAllButton">
                        is it a valid roster?
                    </div>
                    <div className="clearAllButton">
                        Clear All Shift Data
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12} sm={12} xl={12} xs={12} className="d-flex justify-content-around p-1">
                    <div className="exportButton">
                        Export to Excel File
                    </div>
                    <div className="saveRosterToDBButton">
                        Save all data to DB
                    </div>
                </Col>
            </Row>
        </Container> 
    )
}