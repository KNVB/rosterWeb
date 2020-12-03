import './RosterTable.css';
import {Col,Container,Row} from 'react-bootstrap';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import React from "react";
import TableHeader from './tableHeader/TableHeader'; 
import TableBody   from './tableBody/TableBody';
import TableFooter from './TableFooter'; 

class RosterTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state={rosterDate:new Date()}
        this.calendarUtility=new CalendarUtility();
        this.result=this.calendarUtility.getMonthlyCalendar(this.state.rosterDate.getFullYear(),this.state.rosterDate.getMonth());
        this.monthlyCalendar=this.result.monthlyCalendar;
        //let monthlyCalendar=calendarUtility.getMonthlyCalendar(2015,3);

        this.tableHeader = React.createRef();
    }
    render() {
        return(
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
                                &lt; {this.calendarUtility.monthNames[this.state.rosterDate.getMonth()+1]} {this.state.rosterDate.getFullYear()} &gt;
                            </u>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
                            <table id="rosterTable">
                                <TableHeader monthlyCalendar={this.monthlyCalendar} calendarUtility={this.calendarUtility}/>
                                <TableBody tableHeader={this.tableHeader} noOfWorkingDay={this.result.noOfWorkingDay} rosterYear={this.state.rosterDate.getFullYear()} rosterMonth={this.state.rosterDate.getMonth()+1}/>
                                <TableFooter/>
                            </table>
                        </Col>
                    </Row>    
                </Container>
            </div>
        );    
    }
}
export default RosterTable;