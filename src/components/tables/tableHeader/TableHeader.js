import DateRow from './dateRow/DateRow';
import HolidayRow from './holidayRow/HolidayRow';
import WeekDayRow from './weekDayRow/WeekDayRow';
function TableHeader(props){
    //console.log(props.monthlyCalendar);
    //console.log(props);
    return (
        <thead>
            <HolidayRow 
                calendarDateList={props.calendarDateList}
                noOfPrevDate={props.noOfPrevDate}/>
            <WeekDayRow
                calendarUtility={props.calendarUtility}
                calendarDateList={props.calendarDateList}
                noOfPrevDate={props.noOfPrevDate}/>
            <DateRow 
                hightLightCellIndex={props.hightLightCellIndex}
                calendarDateList={props.calendarDateList}
                noOfPrevDate={props.noOfPrevDate}/>
        </thead>
    )
}
export default TableHeader;