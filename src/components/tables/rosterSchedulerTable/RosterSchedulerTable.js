import {useState} from 'react';
import AppConfig from '../../../utils/AppConfig';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import React from 'react';
import TableHeader from '../tableHeader/TableHeader'; 
import '../tables.css';

function RosterSchedulerTable(props){
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    const calendarUtility=new CalendarUtility();
    let result=calendarUtility.getMonthlyCalendar(props.rosterDate.getFullYear(),props.rosterDate.getMonth());
    let monthlyCalendar=result.monthlyCalendar;
    return(
        <table id="rosterTable">
            <TableHeader 
                calendarUtility={calendarUtility} 
                hightLightCellIndex={hightLightCellIndex} 
                monthlyCalendar={monthlyCalendar}
                noOfPrevDate={AppConfig.NO_OF_PREV_DATE}/>
        </table>
    )
}
export default RosterSchedulerTable;