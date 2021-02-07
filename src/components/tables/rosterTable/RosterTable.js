import { useState} from 'react';
import '../tables.css';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import TableBody   from './tableBody/TableBody';
import TableFooter from './TableFooter'; 
import TableHeader from '../tableHeader/TableHeader'; 
function RosterTable(props){
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    const calendarUtility=new CalendarUtility();
    return (
        <table id="rosterTable">
             <TableHeader 
                calendarUtility={calendarUtility} 
                hightLightCellIndex={hightLightCellIndex} 
                monthlyCalendar={props.rosterTableData.result.monthlyCalendar}
                noOfPrevDate={props.rosterTableData.noOfPrevDate}/>
            <TableBody 
                noOfPrevDate={props.rosterTableData.noOfPrevDate}
                noOfWorkingDay={props.rosterTableData.result.noOfWorkingDay}
                rosterData={props.rosterTableData.rosterData}
                rosterParam={props.rosterTableData.rosterParam}
                setHightLightCellIndex={setHightLightCellIndex}
                shiftInfoList={props.rosterTableData.shiftInfoList} />    
            <TableFooter
                shiftInfoList={props.rosterTableData.shiftInfoList}/>
        </table>
    );
}
export default RosterTable;