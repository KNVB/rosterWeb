import './RosterTable.css';
import {Col,Container,Row} from 'react-bootstrap';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import TableHeader from './tableHeader/TableHeader'; 
import TableBody   from './tableBody/TableBody';
import TableFooter from './TableFooter'; 

import { useState,useEffect } from 'react';
function RosterTable(){
    const [rosterDate,setRosterMonth]=useState(new Date());
    const calendarUtility=new CalendarUtility();
    let monthlyCalendar=calendarUtility.getMonthlyCalendar(rosterDate.getFullYear(),rosterDate.getMonth());
    //let monthlyCalendar=calendarUtility.getMonthlyCalendar(2015,3);
    return (
        <div className="App p-1">
            <Container fluid={true} className="tableContainer">
                <Row>
                    <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <u>EMSTF Resident Support & Computer Operation Support Services Team Roster</u>
                    </Col>
                </Row>
                <Row>
                    <Col className="font-weight-bold rosterMonth text-center" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <u>
                            &lt; {calendarUtility.monthNames[rosterDate.getMonth()+1]} {rosterDate.getFullYear()} &gt;
                        </u>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <table id="rosterTable">
                            <TableHeader monthlyCalendar={monthlyCalendar} calendarUtility={calendarUtility}/>
                            <TableBody rosterYear={rosterDate.getFullYear()} rosterMonth={rosterDate.getMonth()+1}/>
                            <TableFooter/>
                        </table>
                    </Col>
                </Row>    
            </Container>
        </div>
    );
}
export default RosterTable;