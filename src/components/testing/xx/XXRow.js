import BorderedAlignCenterCell from './cell/BorderedAlignCenterCell';
import NameCell from './cell/NameCell';
import Parser from "html-react-parser";
import { useContext,useState } from "react";
import RosterWebContext from '../../../utils/RosterWebContext';
import EditableShiftCell from './cell/EditableShiftCell';
import ShiftCell from './cell/ShiftCell';
import useShift from './useShift';
export default function XXRow(props){
  let cellList=[];
  const [isHighLightRow, setIsHighLightRow] = useState(false);
  let [contextValue,updateContext]=useContext(RosterWebContext);
  let monthlyCalendar=contextValue.monthlyCalendar,nameCellCssClass="";
  let itoRoster=contextValue.rosterList[props.itoId];
  let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
  let {getITOStat}=useShift();
  let itoStat=getITOStat(contextValue.activeShiftInfoList,monthlyCalendar.noOfWorkingDay,itoRoster);
  if (isHighLightRow){
    nameCellCssClass="highlightCell";
  }
  for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
    let className=contextValue.selectedRegionUtil.getBorderClass(i+1,props.rowIndex);
    cellList.push(
      <EditableShiftCell
        availableShiftList={itoRoster.availableShiftList}
        className={className}
        key={props.itoId+"_shift_"+i}
        itoId={props.itoId}
        setIsHighLightRow={setIsHighLightRow}>
        {itoRoster.shiftList.presentValue[i+1]}
      </EditableShiftCell>
    )
  }
  for (let i=monthlyCalendar.calendarDateList.length;i<31;i++){
     cellList.push(
      <BorderedAlignCenterCell key={props.itoId+"_shift_"+i}>
      </BorderedAlignCenterCell>  
    )
  }
  return(
    <tr id={props.itoId}>
      <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
      {cellList}
      <BorderedAlignCenterCell>{itoStat.expectedWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.actualWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.lastMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.thisMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.totalBalance.toFixed(2)}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.shiftCountList.aShiftCount}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.shiftCountList.bxShiftCount}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.shiftCountList.cShiftCount}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell>{itoStat.shiftCountList.dxShiftCount}</BorderedAlignCenterCell>
      <BorderedAlignCenterCell className="tailCell">{itoStat.actualWorkingDayCount}</BorderedAlignCenterCell>
    </tr>
  )
}