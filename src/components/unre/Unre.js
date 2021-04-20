import {Col,Container,Row} from 'react-bootstrap';
import {useEffect,useReducer,useState} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import MonthPicker from '../monthPicker/MonthPicker';
import Roster from '../../utils/Roster';
import UnreTable from './UnreTable';
import './Unre.css';
export default function Unre(props){
    let now=new Date();
    let monthPickerMinDate=props.systemParam.monthPickerMinDate;
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);
    let reducer = (state, action) => {
        console.log(action);
        return(action);
    }
    let updateMonth=(newDate)=>{
        console.log("updateMonth="+newDate.getFullYear()+","+newDate.getMonth());
        let output={
            rosterMonth:new Date(newDate.getFullYear(),newDate.getMonth(),1),
            systemParam:props.systemParam
        }
        setData(output);
    };
    const [data, setData] = useReducer(reducer,{rosterMonth: new Date(now.getFullYear(),now.getMonth(),1),systemParam:props.systemParam});
    const[rosterTableData,setRosterTableData]=useState();
 
    useEffect(()=>{
        const getData = async () => {
            let calendarUtility=new CalendarUtility();
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(data.rosterMonth.getFullYear(),data.rosterMonth.getMonth());
            let roster = new Roster();
            let rosterData = await roster.get(data.rosterMonth.getFullYear(),data.rosterMonth.getMonth()+1);
            let shiftInfoList= await roster.getAllActiveShiftInfo();
            
            setRosterTableData(
               {
                "calendarUtility":calendarUtility,
                "monthlyCalendar":monthlyCalendar,
                "rosterList":rosterData,
                "shiftInfoList":shiftInfoList,
                systemParam:data.systemParam
               }
            )
        }
        getData();
    },[data.systemParam,data.rosterMonth]);
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
                        {rosterTableData && <UnreTable rosterTableData={rosterTableData}/>}
                    </Col>
                </Row>
            </Container>        
        </div>
    );
}