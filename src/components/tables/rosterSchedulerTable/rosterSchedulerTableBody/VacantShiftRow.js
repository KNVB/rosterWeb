import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../RosterWebContext';
import Utility from "../../../../utils/Utility";
import VacantShiftNameCell from './cells/vacantShiftNameCell/VacantShiftNameCell';
export default function VacantShiftRow(props){
  let {monthlyCalendar,rosterData,systemParam} = useContext(RosterWebContext);
  let cellList=[];
  let aShiftCount = [],    bxShiftCount = [],    cShiftCount = [],    dxShiftCount = [];
  
  let rosterList = rosterData.rosterList;
  //console.log("VacantShiftRow");
  //console.log(monthlyCalendar.calendarDateList.length,rosterData.rosterList['ITO1_1999-01-01'].shiftList.length);
  for (let i = 0; i < systemParam.noOfPrevDate; i++) {
    cellList.push(
      <BorderedAlignCenterCell
        className="bottomCell"
        key={"vacantPrevCell_" + i}
      />
    );
  }
  Object.keys(props.vacantShiftList).forEach(i=>{
    let vacantShift=props.vacantShiftList[i];
    cellList.push(
      <BorderedAlignCenterCell className="bottomCell" key={"vacantShift_" + i}>
        {vacantShift}
      </BorderedAlignCenterCell>
    );
  })

  for (let i=monthlyCalendar.calendarDateList.length;i<31;i++){
    cellList.push(
      <BorderedAlignCenterCell
        className="bottomCell"
        key={"vacantShift_" + i}
      />
    );
  }
  Object.keys(rosterList).forEach(itoId => {
    let roster = rosterList[itoId];
    let shiftCount = Utility.calculateShiftCount(roster);
    aShiftCount.push(shiftCount.aShiftCount);
    bxShiftCount.push(shiftCount.bxShiftCount);
    cShiftCount.push(shiftCount.cShiftCount);
    dxShiftCount.push(shiftCount.dxShiftCount);
  });
  return(
        <tr>
          <VacantShiftNameCell/>          
          {cellList}
          <BorderedAlignCenterCell className="bottomCell" colSpan="5"/>
          <BorderedAlignCenterCell className="bottomCell">
              {Utility.calculateStdDev(aShiftCount).toFixed(2)}
          </BorderedAlignCenterCell>
          <BorderedAlignCenterCell className="bottomCell">
              {Utility.calculateStdDev(bxShiftCount).toFixed(2)}
          </BorderedAlignCenterCell>
          <BorderedAlignCenterCell className="bottomCell">
              {Utility.calculateStdDev(cShiftCount).toFixed(2)}
          </BorderedAlignCenterCell>
          <BorderedAlignCenterCell className="bottomCell">
              {Utility.calculateStdDev(dxShiftCount).toFixed(2)}
          </BorderedAlignCenterCell>
          <BorderedAlignCenterCell className="bottomCell tailCell"/>
        </tr>
  );      
}