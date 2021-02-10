import {Col,Container,Row} from 'react-bootstrap';
import { SytemContext } from '../../SystemContext';
import {useContext,useEffect,useState} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import MonthPicker from '../../monthPicker/MonthPicker';
import Roster from '../../../utils/Roster';
import RosterSchedulerTable from '../../tables/rosterSchedulerTable/RosterSchedulerTable';
export default function RosterScheduler(){
    const [rosterMonth,setRosterMonth]=useState(new Date());
    const[rosterSchedulerData,setRosterSchedulerData]=useState();
    const systemParam = useContext(SytemContext);
    
    let monthPickerMinDate=systemParam.monthPickerMinDate;
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
    useEffect(()=>{
        const getData = async () => {
            let calendarUtility=new CalendarUtility();
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
            let roster = new Roster();
            let rosterData=await roster.getRosterSchedulerList(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
            let shiftInfoList= await roster.getAllActiveShiftInfo();
            setRosterSchedulerData(
               {
                "monthlyCalendar":monthlyCalendar,
                "rosterData":rosterData,
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
                        {rosterSchedulerData && <RosterSchedulerTable rosterSchedulerData={rosterSchedulerData}/>}
                    </Col>
                </Row>
            </Container>        
        </div>
    );
}
