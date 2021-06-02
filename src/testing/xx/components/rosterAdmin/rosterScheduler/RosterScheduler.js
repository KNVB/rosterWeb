import {useEffect,useState} from 'react';
import {Col,Container,Row} from 'react-bootstrap';
import MonthPicker from '../../../utils/monthPicker/MonthPicker';
import AdminUtility from '../AdminUtility';
import RosterSchedulerTable from './RosterSchedulerTable';
export default function RosterScheduler(props){
    let now=new Date();
    const [rosterMonth,setRosterMonth]=useState(new Date(now.getFullYear(),now.getMonth(),1));
    const [systemParam,setSystemParam]=useState();
    useEffect(()=>{
        const getData = async () => {
            console.log("Undo:Get System Parameter from DB");
            let adminUtility = new AdminUtility(props.changeLoggedInFlag);
            let temp=await adminUtility.getSystemParam();
            let monthPickerMinDate=new Date(temp.monthPickerMinDate.year,temp.monthPickerMinDate.month-1,temp.monthPickerMinDate.date);
            temp.monthPickerMinDate=monthPickerMinDate;
            setSystemParam(temp);
        }
        getData();
    },[props.changeLoggedInFlag])
    function updateMonth(newRosterMonth){
        setRosterMonth(new Date(newRosterMonth.getFullYear(),newRosterMonth.getMonth(),1));
    }
    return (
        <div className="App p-1">
            <Container fluid={true} className="tableContainer">
                <Row>
                    <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <u>EMSTF Resident Support & Computer Operation Support Services Team Roster Scheduler</u>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} sm={12} xl={12} xs={12}>
                        {
                            systemParam && <MonthPicker
                                minDate={systemParam.monthPickerMinDate}
                                onSelect={updateMonth} />
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
                       {systemParam && <RosterSchedulerTable changeLoggedInFlag={props.changeLoggedInFlag} rosterMonth={rosterMonth} systemParam={systemParam}/>}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}