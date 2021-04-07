import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import QQCell from './QQCell';
export default function QQRow(props){
    let {monthlyCalendar,rosterData,setHightLightCellIndex,setRosterData,systemParam}=useContext(RosterWebContext);
    let calendarDateList=monthlyCalendar.calendarDateList;
    let cellList=[],workdayCount=0;
    let itoRoster=rosterData[props.itoId];
    let deHightLight = e => {
        setHightLightCellIndex(-1);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex-systemParam.noOfPrevDate-1);
    }
    let updateShiftData=e=>{
        let realIndex=e.target.cellIndex-systemParam.noOfPrevDate;
        let temp=JSON.parse(JSON.stringify(rosterData));
        temp[props.itoId].shiftList[realIndex]=e.target.textContent;
        setRosterData(temp);
    }
    let shiftList=itoRoster.shiftList;

    for (let i=0;i<systemParam.noOfPrevDate+1;i++){
        cellList.push(
            <td className="QQ" key={"preRoster_"+i}></td>
        )
    }

    for (let i=0;i<calendarDateList.length;i++){
        let shiftType=shiftList[i+1];
        if (shiftType!=='O'){
            workdayCount++
        }        
        cellList.push(
            <QQCell 
                cellIndex={(1+i+systemParam.noOfPrevDate)}
                key={props.itoId+"_"+i}
                onBlur={updateShiftData}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}
                rowIndex={props.rowIndex}>
                    {shiftType}
            </QQCell>
        );
    }
    cellList.push(
        <td className="QQ" key={"workdayCount"}>{workdayCount}</td>
    )
    return(
        <tr>
            {cellList}
        </tr>
    )
}