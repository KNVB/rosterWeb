import {useContext,useEffect} from 'react';
import NameCell from './cells/nameCell/NameCell';
import BorderedCell from './cells/borderedCell/BorderedCell';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import RosterWebContext from '../../utils/RosterWebContext';

export default function WeekdayRow(props){
    let cellList=[];
    let {calendarUtility,systemParam}=useContext(RosterWebContext);
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={"weekDay_-"+i}/>
        )
    }
    
    if(props.monthlyCalendar){
        let monthlyCalendar=props.monthlyCalendar;
        let monthLength=monthlyCalendar.calendarDateList.length;
        
        for (let i=0;i<monthLength;i++){
            let calendarDate=monthlyCalendar.calendarDateList[i];
            let content=calendarUtility.weekdayNames[calendarDate.dayOfWeek];
            let className="",title="";
            if ((content==="S") || (content==="Su") || (calendarDate.publicHoliday))
                className="font-weight-bold phCell";
            if  (monthlyCalendar.calendarDateList[i].publicHoliday){
                title=monthlyCalendar.calendarDateList[i].festivalInfo;
            }
            cellList.push(
                <BorderedAlignCenterCell key={"weekDay_"+i} title={title} className={className}>
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
            <NameCell/>
            {cellList}     
        </tr>
    )
}