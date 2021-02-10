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
                calendarDateList={props.rosterSchedulerData.monthlyCalendar.calendarDateList}
                calendarUtility={calendarUtility} 
                hightLightCellIndex={hightLightCellIndex}                 
                noOfPrevDate={systemParam.noOfPrevDate}/>
            <RosterSchedulerTableBody
                noOfWorkingDay={props.rosterSchedulerData.monthlyCalendar.noOfWorkingDay}
                rosterData={props.rosterSchedulerData.rosterData}               
                setHightLightCellIndex={setHightLightCellIndex}
                shiftInfoList={props.rosterSchedulerData.shiftInfoList}/>
        </table>
    );
}
