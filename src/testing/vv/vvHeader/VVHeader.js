import DateRow from './DateRow';
import HolidayRow from './HolidayRow';
import WeekDayRow from './WeekDayRow';
export default function VVHeader(props){
    return(
        <thead>
            <HolidayRow noOfPrevDate={0}/>
            <WeekDayRow noOfPrevDate={0}/>
            <DateRow noOfPrevDate={0}/>
        </thead>
    )
}
