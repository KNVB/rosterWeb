import { useState} from 'react';
import '../tables.css';
import CalendarUtility from '../../../utils/calendar/CalendarUtility';
import TableBody   from './tableBody/TableBody';
import TableFooter from './TableFooter'; 
import TableHeader from '../tableHeader/TableHeader'; 
function RosterTable(props){
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    const calendarUtility=new CalendarUtility();
    let result=calendarUtility.getMonthlyCalendar(props.rosterDate.getFullYear(),props.rosterDate.getMonth());
    let monthlyCalendar=result.monthlyCalendar;
    return (
        <table id="rosterTable">
             <TableHeader 
                calendarUtility={calendarUtility} 
                hightLightCellIndex={hightLightCellIndex} 
                monthlyCalendar={monthlyCalendar}
                noOfPrevDate={0}/>
            <TableBody 
                noOfPrevDate={0}
                noOfWorkingDay={result.noOfWorkingDay} 
                rosterYear={props.rosterDate.getFullYear()} 
                rosterMonth={props.rosterDate.getMonth()+1} 
                setHightLightCellIndex={setHightLightCellIndex} />    
            <TableFooter/>
        </table>
    );
}
export default RosterTable;