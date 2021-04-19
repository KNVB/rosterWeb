import {useContext,useEffect} from 'react';
import NameCell from './cells/nameCell/NameCell';
import BorderedCell from './cells/borderedCell/BorderedCell';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import RosterWebContext from '../../utils/RosterWebContext';

export default function WeekdayRow(props){
    let cellList=[],monthLength;
    let {calendarUtility,monthlyCalendar,systemParam}=useContext(RosterWebContext);
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={"weekDay_-"+i}/>
        )
    }
    if (monthlyCalendar){
        monthLength=monthlyCalendar.calendarDateList.length;
        for (let i=0;i<monthLength;i++){
            let calendarDate=monthlyCalendar.calendarDateList[i];
            let content=calendarUtility.weekdayNames[calendarDate.dayOfWeek];
            let className="";
            if ((content==="S") || (content==="Su") || (calendarDate.publicHoliday))
                className="font-weight-bold phCell";
            cellList.push(
                <BorderedAlignCenterCell key={"weekDay_"+i} className={className}>
                    {content}
                </BorderedAlignCenterCell>
            )
        }
    
        for(let i=monthLength;i<31;i++){
            cellList.push(
                <BorderedCell key={"weekDay_"+i}/>
            );    
        }
    }    
    return(
        <tr>
            <NameCell>Days</NameCell>
            {cellList}
            <BorderedAlignCenterCell rowSpan="2">
                Total<br/>Hour
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell rowSpan="2">
                Actual<br/>Hour
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell colSpan="8" className="tailCell">
                Hour Off Due
            </BorderedAlignCenterCell>
        </tr>
    )
}