import './RosterTable.css';
import {Col,Container,Row} from 'react-bootstrap';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import MonthPicker from '../monthPicker/MonthPicker';
import TableHeader from './tableHeader/TableHeader'; 
import TableBody   from './tableBody/TableBody';
import TableFooter from './TableFooter'; 

import { useState} from 'react';
function RosterTable_Component(){
    const [rosterDate,setRosterMonth]=useState(new Date());
    const calendarUtility=new CalendarUtility();
    let result=calendarUtility.getMonthlyCalendar(rosterDate.getFullYear(),rosterDate.getMonth());
    let monthlyCalendar=result.monthlyCalendar;
    //let monthlyCalendar=calendarUtility.getMonthlyCalendar(2015,3);
    let updateMonth=(year,month)=>{
        console.log("updateMonth="+year+","+month);
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
                        <MonthPicker onSelect={updateMonth}/>                        
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <table id="rosterTable">
                            <TableHeader monthlyCalendar={monthlyCalendar} calendarUtility={calendarUtility}/>
                            <TableBody noOfWorkingDay={result.noOfWorkingDay} rosterYear={rosterDate.getFullYear()} rosterMonth={rosterDate.getMonth()+1}/>
                            <TableFooter/>
                        </table>
                    </Col>
                </Row>    
            </Container>
        </div>
    );
}
export default RosterTable_Component;