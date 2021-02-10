import HourCell from './HourCell';
import HourOffDueCell from './HourOffDueCell';
import NameCell from '../../cells/nameCell/NameCell';
import WeekDayCell from './WeekDayCell';
function WeekDayRow(props){
    let weekdayRow=[];
    for (let i=props.noOfPrevDate;i>0;i--){
        weekdayRow.push(
            <WeekDayCell key={"weekDay_-"+i}/>
        )
    }
    for (let i=0;i<31;i++){
        if (props.calendarDateList[i]){
            //console.log(props.monthlyCalendar[i]);
            let content=props.calendarUtility.weekdayNames[props.calendarDateList[i].dayOfWeek];
            let className="",title="";
            if ((content==="S") || (content==="Su") || (props.calendarDateList[i].publicHoliday))
                className="font-weight-bold phCell";
            if  (props.calendarDateList[i].publicHoliday){
                title=props.calendarDateList[i].festivalInfo;
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