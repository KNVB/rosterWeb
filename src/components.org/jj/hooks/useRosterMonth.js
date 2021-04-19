import { useEffect,useState } from "react";
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import Roster from '../../../utils/Roster';
export default function useRosterMonth(rosterMonth){
    const[activeShiftInfoList,setActiveShiftInfoList]=useState();
    const[calendarUtility,setCalendarUtility]=useState(new CalendarUtility());
    const[hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    const[monthlyCalendar,setMonthlyCalendar]=useState();
    const[itoRosterList,setITORosterList]=useState();
    
    useEffect(()=>{
        const getData = async () => {
            console.log("getData() is triggered");
            let temp=calendarUtility.getMonthlyCalendar(rosterMonth.getFullYear(),rosterMonth.getMonth());
            setMonthlyCalendar(temp);
            let roster = new Roster();
            temp = await roster.getAllActiveShiftInfo();
            setActiveShiftInfoList(temp);
            temp= await roster.get(rosterMonth.getFullYear(),rosterMonth.getMonth()+1);
            setITORosterList(temp);
        }
        getData();
    },[rosterMonth]);
    return [activeShiftInfoList,calendarUtility,hightLightCellIndex,itoRosterList,monthlyCalendar, setHightLightCellIndex,setITORosterList];
}