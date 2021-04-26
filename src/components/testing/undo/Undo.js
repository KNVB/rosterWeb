import {Col,Container,Row} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import MonthPicker from '../../monthPicker/MonthPicker';
import Roster from '../../../utils/Roster';
import UndoTable from './UndoTable';
export default function Undo(props){
    let monthPickerMinDate=props.systemParam.monthPickerMinDate;
    let now=new Date();
    const [rosterMonth,setRosterMonth]=useState(new Date(now.getFullYear(),now.getMonth(),1));
    const[rosterTableData,setRosterTableData]=useState();
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);
    function updateMonth(newRosterMonth){
        setRosterMonth(new Date(newRosterMonth.getFullYear(),newRosterMonth.getMonth(),1));
    }
    useEffect(()=>{
        const getData = async () => {
            let calendarUtility=new CalendarUtility();
            
            let roster = new Roster();
            let rosterData = await roster.get(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
            let shiftInfoList= await roster.getAllActiveShiftInfo();
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
            setRosterTableData(
               {
                "calendarUtility":calendarUtility,
                "monthlyCalendar":monthlyCalendar,
                "rosterList":rosterData,
                "shiftInfoList":shiftInfoList,
                'systemParam':props.systemParam               
               }
            )
        }
        getData();    
    },[rosterMonth]);
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
                        {rosterTableData && <UndoTable rosterTableData={rosterTableData}/>}
                    </Col>
                </Row>
            </Container>        
        </div>
    );
}