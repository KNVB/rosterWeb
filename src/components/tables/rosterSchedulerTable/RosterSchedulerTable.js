import {useState,useEffect} from 'react';
import RosterWebContext from '../../../RosterWebContext';

import RosterSchedulerTableBody from './rosterSchedulerTableBody/RosterSchedulerTableBody';
import RosterSchedulerTableFooter from './rosterSchedulerTableFooter/RosterSchedulerTableFooter';
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
    let orgRosterData=props.rosterSchedulerData.orgRosterData;
    let rosterMonth=props.rosterSchedulerData.rosterMonth;
    let systemParam=props.rosterSchedulerData.systemParam;
    let yearlyRosterStatistic=props.rosterSchedulerData.yearlyRosterStatistic;
    let mouseUp=(e)=>{
        console.log("mouse up");
    }
    useEffect(()=>{
        console.log("Table");
        setMonthlyCalendar(props.rosterSchedulerData.monthlyCalendar);
        setRosterData(props.rosterSchedulerData.rosterData);
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[props.rosterSchedulerData.monthlyCalendar,props.rosterSchedulerData.rosterData]);

    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        monthlyCalendar,
        orgRosterData,
        rosterData,
        rosterMonth,
        setHightLightCellIndex,
        setRosterData,
        systemParam,
        yearlyRosterStatistic
    };
    //console.log("RosterSchedulerTable");
    //console.log("Preferred Shift List="+JSON.stringify(rosterData.preferredShiftList));
    //console.log("Roster List="+JSON.stringify(rosterData.rosterList));
    
    //console.log("Table org="+JSON.stringify(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList));
    //console.log("Table current="+JSON.stringify(rosterData.rosterList['ITO1_1999-01-01'].shiftList));
    
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={systemParam.noOfPrevDate}/>
                <RosterSchedulerTableBody/>
                <RosterSchedulerTableFooter/>
            </RosterWebContext.Provider>            
        </table>
    );
}