import {Col,Container,Row} from 'react-bootstrap';
import {useContext,useEffect,useState} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import MonthPicker from '../../monthPicker/MonthPicker';
export default function RosterScheduler(props){
    const [rosterMonth,setRosterMonth]=useState(new Date());
    let monthPickerMinDate=props.systemParam.monthPickerMinDate;
    //console.log(monthPickerMinDate);
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);

    //console.log(props);
    //console.log(props.systemParam.monthSelectorMinDate);
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
            </Container>        
        </div>
    )    
}