import {useState} from 'react';
import RosterWebContext from '../../../RosterWebContext';
import RosterSchedulerTableBody from './rosterSchedulerTableBody/RosterSchedulerTableBody';
import TableHeader from '../tableHeader/TableHeader';
export default function RosterSchedulerTable(props){
    
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    let activeShiftInfoList=props.rosterSchedulerData.activeShiftInfoList;
    let calendarUtility=props.rosterSchedulerData.calendarUtility;
    let monthlyCalendar=props.rosterSchedulerData.monthlyCalendar;
    let rosterData=props.rosterSchedulerData.rosterData;
    let systemParam=props.rosterSchedulerData.systemParam;
    
    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        monthlyCalendar,
        rosterData,
        setHightLightCellIndex,
        systemParam    
    };
    //console.log(props.rosterSchedulerData.rosterData);
    console.log(props.rosterSchedulerData.rosterData.rosterList['ITO1_1999-01-01'].shiftList.length);
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={systemParam.noOfPrevDate}/>
                <RosterSchedulerTableBody/>
            </RosterWebContext.Provider>
        </table>
    );
}