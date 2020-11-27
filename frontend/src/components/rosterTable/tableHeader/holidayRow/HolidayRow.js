import NameCell from '../../nameCell/NameCell';
import PHCell from './PHCell';
import RosterTableCell from '../../rosterTableCell/RosterTableCell'
import './HolidayRow.css';
function HolidayRow(props){
    let holidayRow=[];
    for (let i=0;i<31;i++){
        if (props.monthlyCalendar[i]){
            //console.log(props.monthlyCalendar[i]);
            let content=((props.monthlyCalendar[i].festivalInfo)?"PH":"");                
            holidayRow.push(
                <PHCell content={content} key={"PH_"+i} title={props.monthlyCalendar[i].festivalInfo}/>
            )
        } else {
            holidayRow.push(
                <PHCell key={"PH_"+i}/>
            )
        }
    }
    holidayRow.push(
        <RosterTableCell className="tailCell text-center text-danger" 
            colSpan="10"
            key="32">
        </RosterTableCell>
    )
    return(
        <tr>
            <NameCell content="Holiday"/>
            {holidayRow}            
        </tr>
    )
}
export default HolidayRow;