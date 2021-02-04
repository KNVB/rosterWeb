import DateRow from './dateRow/DateRow';
import HolidayRow from './holidayRow/HolidayRow';
import WeekDayRow from './weekDayRow/WeekDayRow';
function TableHeader(props){
    console.log(props.hightLightCellIndex);
    return (
        <thead>
           <HolidayRow
                monthlyCalendar={props.monthlyCalendar}
                rosterParam={props.rosterParam}/>
            <WeekDayRow
                calendarUtility={props.calendarUtility} 
                monthlyCalendar={props.monthlyCalendar}
                rosterParam={props.rosterParam}/>
             <DateRow 
                hightLightCellIndex={props.hightLightCellIndex}
                monthlyCalendar={props.monthlyCalendar}
                rosterParam={props.rosterParam}/>        
        </thead>
    )
}
export default TableHeader;