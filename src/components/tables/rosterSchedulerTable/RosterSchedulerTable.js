import '../tables.css';
import { SytemContext } from '../../SystemContext';
import {useContext,useState} from 'react';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import React from 'react';

import RosterSchedulerTableBody from '../rosterSchedulerTable/rosterSchedulerTableBody/RosterSchedulerTableBody';
import TableHeader from '../tableHeader/TableHeader'; 
export default function RosterSchedulerTable(props){
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    const calendarUtility=new CalendarUtility();
    const systemParam = useContext(SytemContext);
    return (
        <table id="rosterTable">
            <TableHeader 
                calendarUtility={calendarUtility} 
                hightLightCellIndex={hightLightCellIndex} 
                monthlyCalendar={props.rosterTableData.result.monthlyCalendar}
                noOfPrevDate={systemParam.noOfPrevDate}/>
            <RosterSchedulerTableBody
                noOfPrevDate={systemParam.noOfPrevDate}
                noOfWorkingDay={props.rosterTableData.result.noOfWorkingDay}
                rosterData={props.rosterTableData.rosterData}               
                setHightLightCellIndex={setHightLightCellIndex}
                shiftInfoList={props.rosterTableData.shiftInfoList}/>
        </table>
    );
}
