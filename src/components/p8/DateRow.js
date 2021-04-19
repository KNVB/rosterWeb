import {useContext,useEffect} from 'react';
import BorderedCell from './cells/borderedCell/BorderedCell';
import BorderedAlignCenterCell from './cells/BorderedAlignCenterCell';
import NameCell from './cells/nameCell/NameCell';
import RosterWebContext from '../../utils/RosterWebContext';
export default function DateRow(props){
    let cellList=[],monthLength;
    let {hightLightCellIndex,monthlyCalendar,systemParam}=useContext(RosterWebContext);
    for (let i=systemParam.noOfPrevDate;i>0;i--){
        cellList.push(
            <BorderedCell key={"date_-"+i}/>
        )
    }

    if (monthlyCalendar){
        monthLength=monthlyCalendar.calendarDateList.length;
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
            <BorderedAlignCenterCell rowSpan="2">
                Last<br/>Month
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell rowSpan="2">
                This<br/>Month
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell>
                Total
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell>
                Total No. of<br/>A Shift 
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell>
                Total No. of<br/>Bx Shift 
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell>
                Total No. of<br/>C Shift 
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell>
                Total No. of<br/>Dx Shift 
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell className="tailCell">
                No. of<br/>working<br/>day
            </BorderedAlignCenterCell>
        </tr>
    )
}