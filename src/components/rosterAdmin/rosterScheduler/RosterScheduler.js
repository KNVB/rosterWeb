import {Col,Container,Row} from 'react-bootstrap';
import {useEffect,useState} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';

import MonthPicker from '../../monthPicker/MonthPicker';
import Roster from '../../../utils/Roster';
import RosterSchedulerTable from '../../tables/rosterSchedulerTable/RosterSchedulerTable';
import SessionExpiredError from '../../../utils/SessionExpiredError';
import Utility from '../../../utils/Utility';
export default function RosterScheduler(props){
    const [rosterMonth,setRosterMonth]=useState(new Date());
    const[rosterSchedulerData,setRosterSchedulerData]=useState();
    let monthPickerMinDate=props.systemParam.monthPickerMinDate;
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
    let systemParam=props.systemParam;
    useEffect(()=>{
        const getData = async () => {
            let activeShiftInfoList,rosterData, yearlyRosterStatistic;
            let roster = new Roster(props.changeLoggedInFlag);
            activeShiftInfoList= await roster.getAllActiveShiftInfo();
            try{            
                yearlyRosterStatistic=await roster.getYearlyRosterStatistic(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
                rosterData = await roster.getRosterSchedulerList(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
                let calendarUtility=new CalendarUtility();

                let monthlyCalendar=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
                rosterData.duplicateShiftList=Utility.getDuplicateShiftList(monthlyCalendar,rosterData.rosterList);
                Object.keys(rosterData.rosterList).forEach(itoId=>{
                    let itoRoster=rosterData.rosterList[itoId];
                    Utility.calculateITOMonthlyStat(itoRoster,monthlyCalendar.noOfWorkingDay,activeShiftInfoList);
                    rosterData.rosterList[itoId]=itoRoster;
                })
                let orgRosterData= JSON.parse(JSON.stringify(rosterData)); //Don't use object.assign, which is shallow copy
                setRosterSchedulerData(
                   {
                    "activeShiftInfoList":activeShiftInfoList,
                    "calendarUtility":calendarUtility,
                    "changeLoggedInFlag":props.changeLoggedInFlag,
                    "monthlyCalendar":monthlyCalendar,
                    "orgRosterData":orgRosterData,
                    "rosterData":rosterData,
                    "rosterMonth":rosterMonth,                
                    "systemParam":systemParam,
                    "yearlyRosterStatistic":yearlyRosterStatistic
                   }
                );
            }catch (error){
                if (error instanceof SessionExpiredError){
                    //console.log("changeLoggedInFlag");
                    props.changeLoggedInFlag(false);
                }
                alert(error.message);
            }
        }
        getData();    
    },[rosterMonth,systemParam,props]);
    return (
        <div className="App p-1">
            <Container fluid={true} className="tableContainer">
                <Row>
                    <Col className="font-weight-bold text-center tableCaption" md={12} lg={12} sm={12} xl={12} xs={12}>
                        <u>EMSTF Resident Support & Computer Operation Support Services Team Roster</u>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} lg={12} sm={12} xl={12} xs={12} >
                        <MonthPicker 
                            minDate={monthPickerMinDate}
                            onSelect={updateMonth} />
                    </Col>
                </Row>           
                <Row>
                    <Col className="d-flex justify-content-center m-0 p-0" md={12} lg={12} sm={12} xl={12} xs={12}>
                        {rosterSchedulerData && <RosterSchedulerTable rosterSchedulerData={rosterSchedulerData}/>}
                    </Col>
                </Row>
            </Container>        
        </div>
    )    
}