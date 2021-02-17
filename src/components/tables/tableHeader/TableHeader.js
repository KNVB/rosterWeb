import DateRow from './dateRow/DateRow';
import HolidayRow from './holidayRow/HolidayRow';
import WeekDayRow from './weekDayRow/WeekDayRow';
function TableHeader(props){
    return (
        <thead>
            <HolidayRow 
                noOfPrevDate={props.noOfPrevDate}/>
            <WeekDayRow                
                noOfPrevDate={props.noOfPrevDate}/>
            <DateRow 
                noOfPrevDate={props.noOfPrevDate}/>
        </thead>
    )
}
export default TableHeader;