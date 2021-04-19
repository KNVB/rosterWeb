import {Col,Container,Row} from 'react-bootstrap';
import {useEffect,useState} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import MonthPicker from '../monthPicker/MonthPicker';
import Roster from '../../utils/Roster';
import RosterTable from '../tables/rosterTable/RosterTable';
import './RosterViewer.css';
export default function RosterViewer(props){
    let now=new Date();
    const [rosterMonth,setRosterMonth]=useState(new Date(now.getFullYear(),now.getMonth(),1));
    const[rosterTableData,setRosterTableData]=useState();
 
    let monthPickerMinDate=props.systemParam.monthPickerMinDate;
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);
    let updateMonth=(newDate)=>{
        console.log("updateMonth="+newDate.getFullYear()+","+newDate.getMonth());
        setRosterMonth(new Date(newDate.getFullYear(),newDate.getMonth(),1));
    }
    useEffect(()=>{
        const getData = async () => {
            let calendarUtility=new CalendarUtility();
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
            let roster = new Roster();
            let rosterData = await roster.get(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
            let shiftInfoList= await roster.getAllActiveShiftInfo();
            
            setRosterTableData(
               {
                "calendarUtility":calendarUtility,
                "monthlyCalendar":monthlyCalendar,
                "rosterList":rosterData,
                "shiftInfoList":shiftInfoList                
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
                        {rosterTableData && <RosterTable rosterTableData={rosterTableData}/>}
                    </Col>
                </Row>
            </Container>        
        </div>
    );
}