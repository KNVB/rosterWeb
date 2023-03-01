import { useState } from 'react';
import NameCell from '../cells/NameCell';
import ShiftCell from '../cells/ShiftCell';
import StatCell from '../cells/StatCell';
export default function RosterViewerRow({
  activeShiftList,
  calendarDateList,
  itoId,
  isHighLightRow,
  rosterInfo,
  updateHighLight
}) {

  let shiftCellList = [];
  function handleMouseLeaveEvent(e) {
    updateHighLight(-1, -1);
  }
  function handleMouseEnterEvent(e) {
    let cell = e.target;
    let row = cell.closest('tr');

    updateHighLight(cell.cellIndex, row.rowIndex);
  }
  calendarDateList.forEach((calendarDate, i) => {
    let className = '';
    if (rosterInfo.shiftList[calendarDate.dateOfMonth]) {
      className = activeShiftList[rosterInfo.shiftList[calendarDate.dateOfMonth]].cssClassName;
    }
    shiftCellList.push(
      <ShiftCell
        cssClassName={className}
        key={itoId + '_' + i}
        onMouseEnter={handleMouseEnterEvent}
        onMouseLeave={handleMouseLeaveEvent}>
        {rosterInfo.shiftList[i + 1]}
      </ShiftCell>)
  });
  for (let i = calendarDateList.length; i < 31; i++) {
    shiftCellList.push(<ShiftCell key={itoId + '_' + i} />)
  }
  return (
    <tr>
      <NameCell border isHighLight={isHighLightRow}>
        {rosterInfo.itoName}
        <br />
        {rosterInfo.itoPostName} Extn. 2458
      </NameCell>
      {shiftCellList}
      <StatCell>
        {rosterInfo.expectedWorkingHour.toFixed(2)}
      </StatCell>
      <StatCell>
        {rosterInfo.actualWorkingHour.toFixed(2)}
      </StatCell>
      <StatCell>
        {rosterInfo.lastMonthBalance.toFixed(2)}
      </StatCell>
      <StatCell>
        {rosterInfo.thisMonthBalance.toFixed(2)}
      </StatCell>
      <StatCell>
        {rosterInfo.totalBalance.toFixed(2)}
      </StatCell>
      <StatCell>
        {rosterInfo.shiftCountList.aShiftCount}
      </StatCell>
      <StatCell>
        {rosterInfo.shiftCountList.bxShiftCount}
      </StatCell>
      <StatCell>
        {rosterInfo.shiftCountList.cShiftCount}
      </StatCell>
      <StatCell>
        {rosterInfo.shiftCountList.dxShiftCount}
      </StatCell>
      <StatCell>
        {rosterInfo.actualWorkingDayCount}
      </StatCell>
    </tr>
  )
}
