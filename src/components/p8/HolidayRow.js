import {useContext,useEffect} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';
export default function HolidayRow(props){
    let cellList=[],monthLength;
    let {monthlyCalendar,systemParam}=useContext(RosterWebContext);
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={"holiday_-"+i}/>
        )    
    }
    if (monthlyCalendar){
        monthLength=monthlyCalendar.calendarDateList.length;
        for (let i=0;i<monthLength;i++){
            let className="",content="",title;
            if ((monthlyCalendar.calendarDateList[i].festivalInfo) &&(monthlyCalendar.calendarDateList[i].publicHoliday)){
                content="PH";
                className="font-weight-bold phCell";
                title=monthlyCalendar.calendarDateList[i].festivalInfo;
            }          
            cellList.push(
                <BorderedAlignCenterCell className={className} key={"holiday-"+i} title={title}>{content}</BorderedAlignCenterCell>
            );
        }
        for(let i=monthLength;i<31;i++){
            cellList.push(
                <BorderedCell key={"holiday_"+i}/>
            );    
        }
    }
    return(
        <tr>
            <NameCell/>
            {cellList}
            <BorderedCell colSpan={10} className="tailCell"/>
        </tr>
    )
}