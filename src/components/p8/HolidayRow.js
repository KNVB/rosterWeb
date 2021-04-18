import {useContext,useEffect} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';
export default function HolidayRow(props){
    let cellList=[],monthLength;
    let {systemParam}=useContext(RosterWebContext);
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={"holiday_-"+i}/>
        )    
    }
    let monthlyCalendar=props.monthlyCalendar;
    if(monthlyCalendar){
        //console.log(monthlyCalendar);
        monthLength=monthlyCalendar.calendarDateList.length;
        for (let i=0;i<monthLength;i++){
            let className="",content="";
            if ((monthlyCalendar.calendarDateList[i].festivalInfo) &&(monthlyCalendar.calendarDateList[i].publicHoliday)){
                content="PH";
                className="phCell";
            }          
            cellList.push(
                <BorderedAlignCenterCell className={className} key={"holiday-"+i}>{content}</BorderedAlignCenterCell>
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
            <BorderedCell colSpan={10}/>
        </tr>
    )
}