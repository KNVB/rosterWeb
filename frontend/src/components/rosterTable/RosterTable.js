import './RosterTable.css';
import {Col,Container,Row} from 'react-bootstrap';
import config from '../../utils/config'
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import MonthPicker from '../monthPicker/MonthPicker';
import TableHeader from './tableHeader/TableHeader'; 
import TableBody   from './tableBody/TableBody';
import TableFooter from './TableFooter'; 

import { useState} from 'react';
function RosterTable(){
    const [rosterDate,setRosterMonth]=useState(new Date());
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    const calendarUtility=new CalendarUtility();
    let result=calendarUtility.getMonthlyCalendar(rosterDate.getFullYear(),rosterDate.getMonth());
    let monthlyCalendar=result.monthlyCalendar;
    let monthPickerMinDate=JSON.parse(config.MIN_DATE);
    monthPickerMinDate=new Date(monthPickerMinDate.year,monthPickerMinDate.month-1,monthPickerMinDate.date);
    //let monthlyCalendar=calendarUtility.getMonthlyCalendar(2015,3);
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
                        <table id="rosterTable">
                            <TableHeader 
                                calendarUtility={calendarUtility} 
                                hightLightCellIndex={hightLightCellIndex} 
                                monthlyCalendar={monthlyCalendar}/>
                            <TableBody 
                                noOfWorkingDay={result.noOfWorkingDay} 
                                rosterYear={rosterDate.getFullYear()} 
                                rosterMonth={rosterDate.getMonth()+1} 
                                setHightLightCellIndex={setHightLightCellIndex} />
                            <TableFooter/>
                        </table>
                    </Col>
                </Row>    
            </Container>
        </div>
    );
}
export default RosterTable;