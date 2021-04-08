import {useCallback,useContext,useEffect, useState} from 'react';
import CopiedRegion from '../../utils/CopiedRegion';
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
    const [copiedRegion,setCopiedRegion]=useState(new CopiedRegion());
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
    
    let mouseUp=useCallback(()=>{
        console.log("mouse up");
        //console.log(selectedRegion.inSelectMode);
        SelectedRegionUtil.endSelect(selectedRegion,setSelectedRegion);       
    },[selectedRegion]);
    
    useEffect(()=>{
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp])
    let contextValue={}
    if (rosterData){
        contextValue={
            activeShiftInfoList,
            copiedRegion,
            hightLightCellIndex,
            monthlyCalendar,
            rosterData,
            selectedRegion,
            setCopiedRegion,
            setHightLightCellIndex,
            setRosterData,
            setSelectedRegion,
            systemParam
        }
        componentList.push(<QQTableHeader key="header"/>);
        componentList.push(<QQTableBody key="body"/>);
    }
    return(
            <RosterWebContext.Provider value={contextValue}>
                <table id="rosterTable">
                    {componentList}
                </table>
            </RosterWebContext.Provider>
    )
}
