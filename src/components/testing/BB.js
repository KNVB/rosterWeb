import '../tables/tables.css';
import { useState} from 'react';
import CalendarUtility from '../../utils/calendar/CalendarUtility';
import CC from './CC';
import TableHeader from '../tables/tableHeader/TableHeader';
import TableFooter from '../tables/rosterTable/TableFooter';
export default function BB(props){
    const [hightLightCellIndex,setHightLightCellIndex]=useState(-1);
    console.log(props);
    /*
    return (<div></div>);
    */
    let calendarUtility=new CalendarUtility();
    return(
        <table id="rosterTable">
            <TableHeader
                calendarUtility={calendarUtility} 
                hightLightCellIndex={hightLightCellIndex} 
                monthlyCalendar={props.rosterTableData.result.monthlyCalendar}
                noOfPrevDate={0}/>
            <CC
                noOfWorkingDay={props.rosterTableData.result.noOfWorkingDay}
                rosterData={props.rosterTableData.rosterData}
                rosterParam={props.rosterTableData.rosterParam}
                setHightLightCellIndex={setHightLightCellIndex}/>
            <TableFooter/>        
        </table>        
    );    
}