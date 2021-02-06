import {Col,Container,Row} from 'react-bootstrap';
import {useEffect,useState} from 'react';
import AppConfig from '../../utils/AppConfig';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import MonthPicker from '../monthPicker/MonthPicker';
import Roster from '../../utils/Roster';
import RosterTable from '../tables/rosterTable/RosterTable';
import './RosterViewer.css';
function RosterViewer(){
    const [rosterMonth,setRosterMonth]=useState(new Date());
    const[rosterTableData,setRosterTableData]=useState();
    let monthPickerMinDate=JSON.parse(AppConfig.MIN_DATE);
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);
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
            let result=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
            let roster = new Roster();
            let rosterData = await roster.get(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
            let rosterParam = await roster.getRosterParam();
            setRosterTableData(
               {
                "result":result,
                "rosterData":rosterData,
                "rosterParam":rosterParam
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
export default RosterViewer;