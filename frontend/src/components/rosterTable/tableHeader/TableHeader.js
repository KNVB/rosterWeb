import HolidayRow from './holidayRow/HolidayRow';
import WeekDayRow from './weekDayRow/WeekDayRow';
function TableHeader(props){
    //console.log(props.monthlyCalendar);
    return (
        <thead>
            <HolidayRow monthlyCalendar={props.monthlyCalendar}/>
            <WeekDayRow calendarUtility={props.calendarUtility} monthlyCalendar={props.monthlyCalendar}/>
        </thead>
    )
}
export default TableHeader;