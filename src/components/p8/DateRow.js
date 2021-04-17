import {useContext} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';
export default function DateRow(props){
    let cellList=[];
    let {hightLightCellIndex,systemParam}=useContext(RosterWebContext);
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={"date_-"+i}/>
        )
    }
    if(props.monthlyCalendar){
        let monthlyCalendar=props.monthlyCalendar;
        let monthLength=monthlyCalendar.calendarDateList.length;
        for (let i=0;i<monthLength;i++){
            let calendarDate=monthlyCalendar.calendarDateList[i];
            let classNameList=[];
            if (calendarDate.today){
                classNameList.push("todayCell");
            }
            if ((calendarDate.dateOfMonth+systemParam.noOfPrevDate)===hightLightCellIndex){
                classNameList.push("highlightCell");
            }
            //console.log(classNameList);
            cellList.push(
                <BorderedCell key={"date_"+i} className={classNameList.join(' ')}>
                    {calendarDate.dateOfMonth}
                </BorderedCell>    
            ); 
        }
        for(let i=monthLength;i<31;i++){
            cellList.push(
                <BorderedCell key={"date_"+i}/>
            );    
        }
    }
    return (
        <tr>
            <NameCell/>
            {cellList}
        </tr>
    )
}