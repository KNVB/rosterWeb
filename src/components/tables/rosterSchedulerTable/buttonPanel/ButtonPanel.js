import "./ButtonPanel.css";
import {Col,Container,Row} from 'react-bootstrap';
import ClearAllShiftDataButton from './ClearAllShiftDataButton';
import FillEmptyShiftWithOButton from './FillEmptyShiftWithOButton';
import ReloadButton from './ReloadButton';
import SaveRosterToDBButton from './SaveRosterToDBButton';
export default function ButtonPanel(){
    return(
        <Container fluid={true}>
            <Row>
                <Col md={12} lg={12} sm={12} xl={12} xs={12} className="d-flex justify-content-around m-1 p-1">
                    <ReloadButton/>
                    <ClearAllShiftDataButton/>
                    <FillEmptyShiftWithOButton/>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12} sm={12} xl={12} xs={12} className="d-flex justify-content-around m-1 p-1">
                    <div className="exportButton">
                        Export to Excel File
                    </div>
                    <SaveRosterToDBButton/>
                </Col>
            </Row>    
        </Container> 
    )
}