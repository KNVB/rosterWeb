import DateRow from './dateRow/DateRow';
import HolidayRow from './holidayRow/HolidayRow';
import WeekDayRow from './weekDayRow/WeekDayRow';
function TableHeader(props){
    //console.log(props.monthlyCalendar);
    return (
        <thead>
            <HolidayRow 
                monthlyCalendar={props.monthlyCalendar}
                noOfPrevDate={props.noOfPrevDate}/>
            <WeekDayRow
                calendarUtility={props.calendarUtility}
                monthlyCalendar={props.monthlyCalendar}
                noOfPrevDate={props.noOfPrevDate}/>
            <DateRow 
                hightLightCellIndex={props.hightLightCellIndex}
                monthlyCalendar={props.monthlyCalendar}
                noOfPrevDate={props.noOfPrevDate}/>
        </thead>
    )
}
export default TableHeader;