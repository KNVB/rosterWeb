import {useCallback,useEffect, useState} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import P8Body from './P8Body';
import P8Header from './P8Header';

import Roster from '../../utils/Roster';
import RosterWebContext from '../../utils/RosterWebContext';
import './P8.css';
export default function P8Table(props){
    const [activeShiftInfoList,setActiveShiftInfoList]=useState();
    const [monthlyCalendar,setMonthlyCalendar]=useState();
    const [rosterData,setRosterData]=useState();
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    let calendarUtility=new CalendarUtility();
    let systemParam=props.systemParam;

    useEffect(()=>{
        const getData = async () => {
            console.log("getData() is triggered");            
            let temp=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            setMonthlyCalendar(temp);
            let roster = new Roster();
            temp = await roster.getAllActiveShiftInfo();
            setActiveShiftInfoList(temp);
            temp= await roster.get(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            setRosterData (temp);
        }
        getData();    
    },[props.rosterMonth]);
    let contextValue={
        calendarUtility,
        hightLightCellIndex,
        setHightLightCellIndex,
        systemParam
    }
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}> 
                <P8Header monthlyCalendar={monthlyCalendar}/>
                <P8Body 
                    activeShiftInfoList={activeShiftInfoList} 
                    monthlyCalendar={monthlyCalendar}
                    rosterData={rosterData}/>
            </RosterWebContext.Provider>
        </table>       
    )
}