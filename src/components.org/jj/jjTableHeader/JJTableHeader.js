import DateRow from './DateRow';
import HolidayRow from './HolidayRow';
import WeekDayRow from './WeekDayRow';
export default function JJTableHeader(props){
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