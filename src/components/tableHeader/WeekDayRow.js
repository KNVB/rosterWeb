import {useContext} from 'react';
import HourCell from './HourCell';
import HourOffDueCell from './HourOffDueCell';
import NameCell from '../cell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';
import WeekDayCell from './WeekDayCell';

function WeekDayRow(props){
    let weekdayRow=[];
    let {calendarUtility,monthlyCalendar} = useContext(RosterWebContext);
    if (monthlyCalendar){
        for (let i=props.noOfPrevDate;i>0;i--){
            weekdayRow.push(
                <WeekDayCell key={"weekDay_-"+i}/>
            )
        }
        for (let i=0;i<31;i++){
            if (monthlyCalendar.calendarDateList[i]){
                //console.log(props.monthlyCalendar[i]);
                let content=calendarUtility.weekdayNames[monthlyCalendar.calendarDateList[i].dayOfWeek];
                let className="",title="";
                if ((content==="S") || (content==="Su") || (monthlyCalendar.calendarDateList[i].publicHoliday))
                    className="font-weight-bold phCell";
                if  (monthlyCalendar.calendarDateList[i].publicHoliday){
                    title=monthlyCalendar.calendarDateList[i].festivalInfo;
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