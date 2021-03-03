import {useState,useEffect} from 'react';
import RosterWebContext from '../../../RosterWebContext';
import RosterSchedulerTableBody from './rosterSchedulerTableBody/RosterSchedulerTableBody';
import TableHeader from '../tableHeader/TableHeader';

export default function RosterSchedulerTable(props){
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);

    /**
     * Both monthlyCalendar and rosterData must be a state variable,
     * otherwise their data are not in sync.
     */
    const [rosterData,setRosterData]=useState(props.rosterSchedulerData.rosterData);
    const [monthlyCalendar,setMonthlyCalendar]=useState(props.rosterSchedulerData.monthlyCalendar);

    let activeShiftInfoList=props.rosterSchedulerData.activeShiftInfoList;
    let calendarUtility=props.rosterSchedulerData.calendarUtility;
    let systemParam=props.rosterSchedulerData.systemParam;

    let mouseUp=(e)=>{
        console.log("mouse up");
    }
    useEffect(()=>{
        console.log("Table");
        setMonthlyCalendar(props.rosterSchedulerData.monthlyCalendar);
        setRosterData(props.rosterSchedulerData.rosterData);
        document.addEventListener('mouseup',mouseUp);
    },[props.rosterSchedulerData.monthlyCalendar,props.rosterSchedulerData.rosterData]);

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