import {useCallback,useEffect, useState} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import QQTableBody from './QQTableBody';
import QQTableHeader from './QQTableHeader';
import Roster from '../../utils/Roster';
import RosterWebContext from '../../utils/RosterWebContext';
import SelectedRegion from '../../utils/SelectedRegion';
import SelectedRegionUtil from '../../utils/SelectedRegionUtil';

export default function QQTable(props){
    const[activeShiftInfoList,setActiveShiftInfoList]=useState();
    const [monthlyCalendar,setMonthlyCalendar]=useState();
    const [rosterData,setRosterData]=useState();
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    const [selectedRegion,setSelectedRegion]=useState(new SelectedRegion());
    let componentList=[];
    let systemParam=props.systemParam;
    useEffect(()=>{
        const getData = async () => {
            console.log("getData() is triggered");
            let calendarUtility=new CalendarUtility();
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
    let contextValue={}
    if (rosterData){
        contextValue={
            activeShiftInfoList,
            hightLightCellIndex,
            monthlyCalendar,
            rosterData,
            selectedRegion,
            setHightLightCellIndex,
            setRosterData,
            setSelectedRegion,
            systemParam
        }
        componentList.push(<QQTableHeader key="header"/>);
        componentList.push(<QQTableBody key="body"/>);
    }
    return(
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                {componentList}
            </RosterWebContext.Provider>
        </table>
    )
}
