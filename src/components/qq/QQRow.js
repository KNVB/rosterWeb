import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import QQCell from './QQCell';
export default function QQRow(props){
    let {monthlyCalendar,rosterData,setHightLightCellIndex,setRosterData,systemParam}=useContext(RosterWebContext);
    let calendarDateList=monthlyCalendar.calendarDateList;
    let cellList=[],workdayCount=0;
    let itoRoster=rosterData[props.itoId];
    let deHightLight = e => {
        e.preventDefault();
        setHightLightCellIndex(-1);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex-systemParam.noOfPrevDate-1);
    }
    let updateShiftData=e=>{
        e.preventDefault();
        let realIndex=e.target.cellIndex-systemParam.noOfPrevDate;
        let temp=JSON.parse(JSON.stringify(rosterData));
        temp[props.itoId].shiftList[realIndex]=e.target.textContent;
        setRosterData(temp);
    }
    let shiftList=itoRoster.shiftList;
    //console.log(itoRoster);
    cellList.push(
        <td className="QQ" key={"itoName_"+props.itoId}>{itoRoster.itoName}<br/>{itoRoster.itoPostName}</td>
    )

    for (let i=0;i<systemParam.noOfPrevDate;i++){
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
                dateIndex={1+i}
                itoId={props.itoId}
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
        <tr id={props.itoId+"_roster"}>
            {cellList}
        </tr>
    )
}