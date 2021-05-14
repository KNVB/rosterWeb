import {useContext} from 'react';
import './VacantShiftRow.css';
import BorderedCell from '../cell/BorderedCell';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import NameCell from '../cell/NameCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function VacantShiftRow(props){
    let cellList=[];
    let [contextValue, updateContext]=useContext(RosterWebContext);
    for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
        cellList.push(<BorderedCell className="bottomCell" key={'preVacant_'+i}/>);
    }
    for (let i=0;i<contextValue.monthlyCalendar.calendarDateList.length;i++){
        let vacantShift = contextValue.activeShiftInfoList.essentialShift;
        Object.keys(contextValue.rosterList).forEach(itoId=>{
            let roster = contextValue.rosterList[itoId].presentValue;
            if (roster.shiftList[i+1]){
                let shiftTypeList = roster.shiftList[i+1].split("+");
                shiftTypeList.forEach(shiftType => {
                    if (roster.availableShiftList.includes(shiftType)){
                        if (shiftType === "b1") {
                            vacantShift = vacantShift.replace("b", "");
                        } else {
                            vacantShift = vacantShift.replace(shiftType, "");
                        }
                    }
                });
            }
        })
        cellList.push(
            <BorderedAlignCenterCell className="bottomCell" key={"vacantShift_" + i}>
              {vacantShift}
            </BorderedAlignCenterCell>
        );
    }
    for (let i=contextValue.monthlyCalendar.calendarDateList.length;i<31;i++){
        cellList.push(
          <BorderedCell
            className="bottomCell"
            key={"vacantShift_" + i}
          />
        );
      }
    return(
        <tr>
            <NameCell className="bottomCell vacantShiftName pr-1">Vacant Shifts</NameCell>
            {cellList}
            <BorderedCell className="bottomCell p-0 m-0 tailCell" colSpan="10">
                <div className="d-flex justify-content-around flex-grow-1">
                    <div>A Shift σ:{props.itoStat.aShiftStdDev} </div>
                    <div>Bx Shift σ:{props.itoStat.bxShiftStdDev} </div>
                    <div>C Shift σ:{props.itoStat.cShiftStdDev} </div>
                    <div>Average σ:{props.itoStat.avgStdDev}</div>
                </div>
            </BorderedCell>
        </tr>
    )
}