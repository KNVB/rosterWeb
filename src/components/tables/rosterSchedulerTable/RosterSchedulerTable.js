import {useState,useEffect} from 'react';
import RosterWebContext from '../../../RosterWebContext';
import RosterSchedulerTableBody from './rosterSchedulerTableBody/RosterSchedulerTableBody';
import TableHeader from '../tableHeader/TableHeader';

export default function RosterSchedulerTable(props){
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    const [rosterData,setRosterData]=useState(props.rosterSchedulerData.rosterData);

    let activeShiftInfoList=props.rosterSchedulerData.activeShiftInfoList;
    let calendarUtility=props.rosterSchedulerData.calendarUtility;
    let monthlyCalendar=props.rosterSchedulerData.monthlyCalendar;
    let systemParam=props.rosterSchedulerData.systemParam;
    useEffect(()=>{
        setRosterData(props.rosterSchedulerData.rosterData);
    },[props.rosterSchedulerData.rosterData])
    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        monthlyCalendar,
        rosterData, 
        setHightLightCellIndex,
        setRosterData,
        systemParam
    };
    //console.log("Preferred Shift List="+JSON.stringify(rosterData.preferredShiftList));
    //console.log("Roster List="+JSON.stringify(rosterData.rosterList));
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={systemParam.noOfPrevDate}/>
                <RosterSchedulerTableBody/>
            </RosterWebContext.Provider>            
        </table>
    );
}