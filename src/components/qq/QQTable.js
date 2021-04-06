import {useEffect, useMemo,useState} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import QQTableBody from './QQTableBody';
import QQTableHeader from './QQTableHeader';
import Roster from '../../utils/Roster';
export default function QQTable(props){
    const[rosterTableData,setRosterTableData]=useState();
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    let componentList=[];
    useEffect(()=>{
        const getData = async () => {
            console.log("getData() is triggered");
            let calendarUtility=new CalendarUtility();
            let monthlyCalendar=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            let roster = new Roster();
            let rosterData = await roster.get(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            let shiftInfoList= await roster.getAllActiveShiftInfo();
            setRosterTableData(
               {
                "calendarUtility":calendarUtility,
                "monthlyCalendar":monthlyCalendar,
                "rosterList":rosterData,
                "shiftInfoList":shiftInfoList                
               }
            )
        }
        getData();    
    },[props.rosterMonth]);
    if (rosterTableData){
        console.log(rosterTableData.rosterList['ITO1_1999-01-01'].shiftList);
        componentList.push(<QQTableHeader key="header" rosterTableData={rosterTableData} hightLightCellIndex={hightLightCellIndex}/>);
        componentList.push(<QQTableBody key="body" 
                            rosterTableData={rosterTableData} 
                            setHightLightCellIndex={setHightLightCellIndex}
                            setRosterTableData={setRosterTableData}/>);
    }
    return(
        <table border="1">
            {componentList}
        </table>
    )
}
