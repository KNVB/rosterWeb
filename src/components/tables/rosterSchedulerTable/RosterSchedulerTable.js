import {useState} from 'react';
import RosterWebContext from '../../../RosterWebContext';
import SchedulerTableBody from './schedulerTableBody/SchedulerTableBody';
import TableHeader from '../tableHeader/TableHeader';
import Utility from '../../../utils/Utility';
export default function RosterSchedulerTable(props){
    
    const [hightLightCellIndex, setHightLightCellIndex] = useState(-1);
    const [highLightRowIndex, setHighLightRowIndex] = useState();
    
    let activeShiftInfoList=props.rosterSchedulerData.activeShiftInfoList;
    let calendarUtility=props.rosterSchedulerData.calendarUtility;
    let monthlyCalendar=props.rosterSchedulerData.monthlyCalendar;
    let systemParam=props.rosterSchedulerData.systemParam;
    let rosterData=props.rosterSchedulerData.rosterData;
    
    let contextValue={
        activeShiftInfoList,
        calendarUtility,
        hightLightCellIndex,
        highLightRowIndex,
        monthlyCalendar,
        rosterData,
        setHightLightCellIndex,
        setHighLightRowIndex,
        systemParam    
    };
    
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                <TableHeader noOfPrevDate={systemParam.noOfPrevDate}/>
                <SchedulerTableBody/>
            </RosterWebContext.Provider>
        </table>
    );
}