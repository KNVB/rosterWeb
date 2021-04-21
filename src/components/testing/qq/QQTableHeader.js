import {useContext} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function QQTableHeader(props){
    //console.log(props.rosterTableData.monthlyCalendar)
    let {hightLightCellIndex,monthlyCalendar,systemParam}=useContext(RosterWebContext);
    let calendarDateList=monthlyCalendar.calendarDateList;
    let cellList=[];

    for (let i=0;i<systemParam.noOfPrevDate+1;i++){
        cellList.push(
            <td className="QQ" key={"preCal_"+i}></td>
        )
    }
    for (let i=0;i<calendarDateList.length;i++){
        if (hightLightCellIndex===i){
            cellList.push(
                <td className="QQ highlightCell" key={"date_"+i}>{i+1}</td>
            )
        } else {
            cellList.push(
                <td className="QQ" key={"date_"+i}>{i+1}</td>
            )
        }
    }
    cellList.push(
        <td className="QQ" key="workdayCount"></td>
    )
    return(
        <thead>
            <tr>
                {cellList}
            </tr>
        </thead>
    )
}