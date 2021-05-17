import {useContext} from 'react';
import './HolidayRow.css';
import NameCell from '../cell/NameCell';
import PHCell from './PHCell';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function HolidayRow(props){
    let holidayCellList=[];
    //console.log(props);
    let [contextValue] = useContext(RosterWebContext);
  
    for (let i=props.noOfPrevDate;i>0;i--){
        holidayCellList.push(
            <PHCell key={"PH_-"+i}/>    
        )
    }
    let monthlyCalendar=contextValue.monthlyCalendar;
    for (let i=0;i<31;i++){
        if (monthlyCalendar.calendarDateList[i]){
            let content=(((monthlyCalendar.calendarDateList[i].festivalInfo) &&(monthlyCalendar.calendarDateList[i].publicHoliday))?"PH":"");                
            holidayCellList.push(
                <PHCell key={"PH_"+i} title={monthlyCalendar.calendarDateList[i].festivalInfo}>
                    {content}
                </PHCell>    
            )
        } else {
            holidayCellList.push(
                <PHCell key={"PH_"+i}/>
            )
        }
    }
    holidayCellList.push(
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
            {holidayCellList}            
        </tr>
    )    
}