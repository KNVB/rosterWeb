import {useContext} from 'react';
import './VacantShiftRow.css';
import BorderedCell from '../cell/BorderedCell';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import NameCell from '../cell/NameCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function VacantShiftRow(props){
    let cellList=[];
    let [contextValue]=useContext(RosterWebContext);
    for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
        cellList.push(<BorderedCell className="bottomCell" key={'preVacant_'+i}/>);
    }
    for (let i=0;i<contextValue.monthlyCalendar.calendarDateList.length;i++){
        cellList.push(
            <BorderedAlignCenterCell className="bottomCell" key={"vacantShift_" + i}>
              {props.itoStat.vacantShiftList[i+1]}
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