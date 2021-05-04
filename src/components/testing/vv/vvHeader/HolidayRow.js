import {useContext} from 'react';
import './HolidayRow.css';
import NameCell from '../cell/NameCell';
import PHCell from './PHCell';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function HolidayRow(props){
    let holidayRow=[];
    //console.log(props);
    let {monthlyCalendar} = useContext(RosterWebContext);
    if (monthlyCalendar){
        for (let i=props.noOfPrevDate;i>0;i--){
            holidayRow.push(
                <PHCell key={"PH_-"+i}/>    
            )
        }
        for (let i=0;i<31;i++){
            if (monthlyCalendar.calendarDateList[i]){
                let content=(((monthlyCalendar.calendarDateList[i].festivalInfo) &&(monthlyCalendar.calendarDateList[i].publicHoliday))?"PH":"");                
                holidayRow.push(
                    <PHCell key={"PH_"+i} title={monthlyCalendar.calendarDateList[i].festivalInfo}>
                        {content}
                    </PHCell>    
                )
            } else {
                holidayRow.push(
                    <PHCell key={"PH_"+i}/>
                )
            }
        }
        holidayRow.push(
            <BorderedAlignCenterCell className="p-0 tailCell text-danger" 
                colSpan="10"
                key="32">
            </BorderedAlignCenterCell>
        )
    }    
    return(
        <tr>
            <NameCell>
                Holiday
            </NameCell>    
            {holidayRow}            
        </tr>
    )
}