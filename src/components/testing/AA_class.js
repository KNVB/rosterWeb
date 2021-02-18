import {Col,Container,Row} from 'react-bootstrap';
import AppConfig from '../../utils/AppConfig';
import BB from './BB';
import React from "react";
import Roster from '../../utils/Roster';
import MonthPicker from '../monthPicker/MonthPicker';
class AA extends React.Component {
    constructor(){
        super();
        this.state = {"rosterMonth": new Date()};
        this.rosterTableData={};
        this.monthPickerMinDate=JSON.parse(AppConfig.MIN_DATE);
        this.monthPickerMinDate=new Date(this.monthPickerMinDate.year,this.monthPickerMinDate.month-1,this.monthPickerMinDate.date);
        
        this.updateMonth =(year,month)=>{
            //console.log(year,month);
            let newDate=new Date();
            newDate.setFullYear(year);
            newDate.setMonth(month);
            this.setState({"rosterMonth":newDate});
        }
        this.getData=async()=>{
            console.log("Get Data");
            let roster = new Roster();
            let rosterData = await roster.get(this.state.rosterMonth.getFullYear(), this.state.rosterMonth.getMonth()+1);
            let rosterParam = await roster.getRosterParam();
            this.rosterTableData["rosterData"]=rosterData;
            this.rosterTableData["rosterParam"]=rosterParam;
        }
    }    
    componentDidUpdate() {
        console.log("update:"+this.state.rosterMonth);
    }
    
    render(){
        return(
            <div className="App p-1">
                <Container fluid={true} className="tableContainer">
                    <Row>
                        <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                            <u>Roster</u>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} lg={12} sm={12} xl={12} xs={12}>
                            <MonthPicker 
                                minDate={this.monthPickerMinDate}
                                onSelect={this.updateMonth} />                        
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
                            <BB rosterTableData={this.rosterTableData}/>
                        </Col>
                    </Row>     
                </Container>        
            </div>

        );
    }  
}
export default AA;
