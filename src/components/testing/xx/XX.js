import {Col,Container,Row} from 'react-bootstrap';
import {useState} from 'react';
import MonthPicker from '../../monthPicker/MonthPicker';
import XXTable from './XXTable';
export default function XX(props){
    let monthPickerMinDate=props.systemParam.monthPickerMinDate;
    let now=new Date();
    const [rosterMonth,setRosterMonth]=useState(new Date(now.getFullYear(),now.getMonth(),1));
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);
    function updateMonth(newRosterMonth){
        setRosterMonth(new Date(newRosterMonth.getFullYear(),newRosterMonth.getMonth(),1));
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
                       <XXTable rosterMonth={rosterMonth} systemParam={props.systemParam}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )    
}