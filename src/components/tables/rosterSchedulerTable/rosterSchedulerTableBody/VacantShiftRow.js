import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../RosterWebContext';
import Utility from "../../../../utils/Utility";
import VacantShiftNameCell from './cells/vacantShiftNameCell/VacantShiftNameCell';
export default function VacantShiftRow(props){
    let {activeShiftInfoList,monthlyCalendar,rosterData,systemParam} = useContext(RosterWebContext);
    let cellList=[],i;
    let aShiftCount = [],    bxShiftCount = [],    cShiftCount = [],    dxShiftCount = [];
    let essentialShift=activeShiftInfoList.essentialShift;
    //console.log(activeShiftInfoList);
    //console.log(rosterData);

    let rosterList = rosterData.rosterList;
    for (i = 0; i < systemParam.noOfPrevDate; i++) {
      cellList.push(
        <BorderedAlignCenterCell
          className="bottomCell"
          key={"vacantPrevCell_" + i}
        />
      );
    }
    for (i = 0; i < monthlyCalendar.calendarDateList.length; i++) {
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
      for (let j = i; j < 31; j++) {
        cellList.push(
          <BorderedAlignCenterCell
            className="bottomCell"
            key={"vacantShift_" + j}
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
    return  <tr>
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
 }