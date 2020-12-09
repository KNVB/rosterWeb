import HourCell from './HourCell';
import HourOffDueCell from './HourOffDueCell';
import NameCell from '../../../cells/nameCell/NameCell';
import WeekDayCell from './WeekDayCell';
function WeekDayRow(props){
    let weekdayRow=[];
    for (let i=0;i<31;i++){
        if (props.monthlyCalendar[i]){
            //console.log(props.monthlyCalendar[i]);
            let content=props.calendarUtility.weekdayNames[props.monthlyCalendar[i].dayOfWeek];
            let className="",title="";
            if ((content==="S") || (content==="Su") || (props.monthlyCalendar[i].publicHoliday))
                className="font-weight-bold phCell";
            if  (props.monthlyCalendar[i].publicHoliday){
                title=props.monthlyCalendar[i].festivalInfo;
            }            
            weekdayRow.push(
                <WeekDayCell className={className} key={"weekDay_"+i} title={title}>
                    {content}
                </WeekDayCell>    
            );
        } else {
            weekdayRow.push(<WeekDayCell className="" key={"weekDay_"+i}/>);
        }
    }        
    return (
        <tr>
            <NameCell>
                Days
            </NameCell>    
            {weekdayRow}
            <HourCell>
                Total<br/>Hour
            </HourCell>
            <HourCell>
                Actual<br/>Hour
            </HourCell>
            <HourOffDueCell/>
        </tr>
    )
}
export default WeekDayRow;