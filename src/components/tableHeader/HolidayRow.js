import {useContext} from 'react';
import './HolidayRow.css';
import NameCell from '../cell/NameCell';
import PHCell from './PHCell';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../utils/RosterWebContext';
export default function HolidayRow(props){
    let holidayRow=[];
    //console.log(props);
    let [contextValue, updateContext] = useContext(RosterWebContext);

    for (let i=props.noOfPrevDate;i>0;i--){
        holidayRow.push(
            <PHCell key={"PH_-"+i}/>    
        )
    }
    for (let i=0;i<31;i++){
        if (contextValue.monthlyCalendar.calendarDateList[i]){
            let content=(((contextValue.monthlyCalendar.calendarDateList[i].festivalInfo) &&(contextValue.monthlyCalendar.calendarDateList[i].publicHoliday))?"PH":"");                
            holidayRow.push(
                <PHCell key={"PH_"+i} title={contextValue.monthlyCalendar.calendarDateList[i].festivalInfo}>
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
    return(
        <tr>
            <NameCell>
                Holiday
            </NameCell>    
            {holidayRow}            
        </tr>
    )
}