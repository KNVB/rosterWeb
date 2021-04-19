import {useCallback,useEffect, useState} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import P8Body from './P8Body';
import P8Header from './P8Header';

import Roster from '../../utils/Roster';
import RosterWebContext from '../../utils/RosterWebContext';
import useSelectedRegion from './useSelectedRegion';
import useShift from './useShift';
import './P8.css';
export default function P8Table(props){
    const [activeShiftInfoList,setActiveShiftInfoList]=useState();
    const [monthlyCalendar,setMonthlyCalendar]=useState();
    const [rosterData,setRosterData]=useState();
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    const [getITOStat]=useShift();
    let [startSelect,endSelect,updateSelect,copySelectedRegion,getBorderClass,pasteCopiedRegion]=useSelectedRegion();
    let calendarUtility=new CalendarUtility();
    let systemParam=props.systemParam;

    useEffect(()=>{
        const getData = async () => {
            console.log("getData() is triggered");            
            let roster = new Roster();
            let temp= await roster.get(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth()+1);
            setRosterData (temp);
            temp = await roster.getAllActiveShiftInfo();
            setActiveShiftInfoList(temp);

            temp=calendarUtility.getMonthlyCalendar(props.rosterMonth.getFullYear(),props.rosterMonth.getMonth());
            setMonthlyCalendar(temp);
        }
        getData();    
    },[props.rosterMonth]);
    let mouseUp=useCallback((e)=>{
        console.log("mouse up");
        endSelect();
      });
    useEffect(()=>{
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp]);
    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        copySelectedRegion,
        getBorderClass,
        getITOStat,
        hightLightCellIndex,
        monthlyCalendar,
        pasteCopiedRegion,
        rosterData,
        setHightLightCellIndex,
        startSelect,
        systemParam,
        updateSelect
    }
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}> 
                <P8Header/>
                <P8Body/>
            </RosterWebContext.Provider>
        </table>       
    )
}