import DateRow from './DateRow';
import HolidayRow from './HolidayRow';
import WeekdayRow from './WeekdayRow';
export default function P8Header(props){   
    return (
        <thead>
            <HolidayRow monthlyCalendar={props.monthlyCalendar}/>
            <WeekdayRow monthlyCalendar={props.monthlyCalendar}/>
            <DateRow monthlyCalendar={props.monthlyCalendar}/>
        </thead>
    )
}