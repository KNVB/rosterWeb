import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import QQCell from './QQCell';
export default function QQRow(props){
    let {monthlyCalendar,rosterData,setHightLightCellIndex}=useContext(RosterWebContext);
    let calendarDateList=monthlyCalendar.calendarDateList;
    let cellList=[];
    let deHightLight = e => {
        setHightLightCellIndex(-1);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
    }    
    let updateShiftData=e=>{

    }
    let itoRoster=rosterData[props.itoId];
    let shiftList=itoRoster.shiftList;
    for (let i=0;i<calendarDateList.length;i++){
        let shiftType=shiftList[i+1];
        cellList.push(
            <QQCell key={props.itoId+"_"+i}
                onBlur={updateShiftData}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}>
                    {shiftType}
            </QQCell>
        );
    }
    return(
        <tr>
            {cellList}
        </tr>
    )
}