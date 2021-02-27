import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../RosterWebContext';
import Utility from "../../../../utils/Utility";
import VacantShiftNameCell from './cells/vacantShiftNameCell/VacantShiftNameCell';
export default function VacantShiftRow(){
  let {activeShiftInfoList,monthlyCalendar,rosterData,systemParam} = useContext(RosterWebContext);
  let cellList=[];
  let aShiftCount = [],    bxShiftCount = [],    cShiftCount = [],    dxShiftCount = [];
  let essentialShift=activeShiftInfoList.essentialShift;
  let rosterList = rosterData.rosterList;
  
  //console.log(monthlyCalendar.calendarDateList.length,rosterData.rosterList['ITO1_1999-01-01'].shiftList.length);
  for (let i = 0; i < systemParam.noOfPrevDate; i++) {
    cellList.push(
      <BorderedAlignCenterCell
        className="bottomCell"
        key={"vacantPrevCell_" + i}
      />
    );
  }
  for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
    let vacantShift = essentialShift;
    Object.keys(rosterList).forEach(itoId => {
      let roster = rosterList[itoId];
      let shiftTypeList = roster.shiftList[i].shift.split("+");
      shiftTypeList.forEach(shiftType => {
        if (shiftType === "b1") {
          vacantShift = vacantShift.replace("b", "");
        } else {
          vacantShift = vacantShift.replace(shiftType, "");
        }
      });
    });
    cellList.push(
      <BorderedAlignCenterCell className="bottomCell" key={"vacantShift_" + i}>
        {vacantShift}
      </BorderedAlignCenterCell>
    );
  }
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
    let shiftCount = Utility.calculateShiftCount(roster.shiftList);
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