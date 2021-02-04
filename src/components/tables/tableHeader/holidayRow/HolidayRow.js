import NameCell from '../../cells/nameCell/NameCell';
import PHCell from './PHCell';
import RosterTableCell from '../../cells/rosterTableCell/RosterTableCell'
import './HolidayRow.css';
function HolidayRow(props){
    let holidayRow=[];
    let monthlyCalendar=props.monthlyCalendar;

    //console.log("monthlyCalendar="+JSON.stringify(monthlyCalendar));

    for (let i=0;i<31;i++){
        if (monthlyCalendar.calendarDateList[i]){
            let content=(((monthlyCalendar.calendarDateList[i].festivalInfo) &&(monthlyCalendar.calendarDateList[i].publicHoliday))?"PH":"");
            holidayRow.push(
                <PHCell key={"PH_"+i} title={monthlyCalendar.calendarDateList[i].festivalInfo}>
                    {content}
                </PHCell>    
            )    
        }else {
            holidayRow.push(
                <PHCell key={"PH_"+i}/>
            )
        }
    }
    holidayRow.push(
        <RosterTableCell className="p-0 tailCell text-center text-danger" 
            colSpan="10"
            key="32">
        </RosterTableCell>
    )
    return(
        <tr>
            <NameCell>
                Holiday
            </NameCell>    
            {holidayRow}            
        </tr>
    )
}
export default HolidayRow;