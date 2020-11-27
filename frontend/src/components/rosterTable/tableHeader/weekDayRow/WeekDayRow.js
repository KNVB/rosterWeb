import HourCell from './HourCell';
import HourOffDueCell from './HourOffDueCell';
import NameCell from '../../nameCell/NameCell';
import WeekDayCell from './WeekDayCell';
import { Fragment } from 'react';
function WeekDayRow(props){
    let weekdayRow=[];
    for (let i=0;i<31;i++){
        if (props.monthlyCalendar[i]){
            //console.log(props.monthlyCalendar[i]);
            var content=props.calendarUtility.weekdayNames[props.monthlyCalendar[i].dayOfWeek];
            var className="",title="";
            if ((content==="Su") || (props.monthlyCalendar[i].publicHoliday))
                className="font-weight-bold phCell";
            if  (props.monthlyCalendar[i].publicHoliday){
                title=props.monthlyCalendar[i].festivalInfo;
            }   
            weekdayRow.push(<WeekDayCell className={className} content={content} key={"weekDay_"+i} title={title}/>);
        } else {
            weekdayRow.push(<WeekDayCell className="" key={"weekDay_"+i}/>);
        }
    }        
    return (
        <tr>
            <NameCell content="Days"/>
            {weekdayRow}
            <HourCell content={<Fragment>Total<br/>Hour</Fragment>}/>
            <HourCell content={<Fragment>Actual<br/>Hour</Fragment>}/>
            <HourOffDueCell/>
        </tr>
    )
}
export default WeekDayRow;