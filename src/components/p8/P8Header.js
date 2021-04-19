import DateRow from './DateRow';
import HolidayRow from './HolidayRow';
import WeekdayRow from './WeekdayRow';
export default function P8Header(props){   
    return (
        <thead>
            <HolidayRow/>
            <WeekdayRow/>
            <DateRow/>
        </thead>
    )
}