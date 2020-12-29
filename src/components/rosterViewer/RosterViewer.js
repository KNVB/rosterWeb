import {Col,Container,Row} from 'react-bootstrap';
import {useState} from 'react';
import AppConfig from '../../utils/AppConfig';
import MonthPicker from '../monthPicker/MonthPicker';
import RosterTable from '../rosterTable/RosterTable';
import './RosterViewer.css';
function RosterViewer(){
    const [rosterDate,setRosterMonth]=useState(new Date());
    let monthPickerMinDate=JSON.parse(AppConfig.MIN_DATE);
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);
    let updateMonth=(year,month)=>{
        //console.log("updateMonth="+year+","+month);
        let newDate=new Date();
        newDate.setFullYear(year);
        newDate.setMonth(month);
        setRosterMonth(newDate);
    }
    return (
        <div className="App p-1">
            <Container fluid={true} className="tableContainer">
                <Row>
                    <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <u>EMSTF Resident Support & Computer Operation Support Services Team Roster</u>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} sm={12} xl={12} xs={12}>
                        <MonthPicker 
                            minDate={monthPickerMinDate}
                            onSelect={updateMonth} />                        
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <RosterTable rosterDate={rosterDate}/>
                    </Col>
                </Row>
            </Container>        
        </div>
    );
}
export default RosterViewer;