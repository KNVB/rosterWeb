import { useState } from 'react';
import NameCell from '../../cells/NameCell';
import ShiftCell from '../../cells/ShiftCell';
import StatCell from '../../cells/StatCell';
export default function EditableRosterRow({
    activeShiftList,
    calendarDateList,
    itoId,
    rosterInfo,
    systemParam,
    updateHighLightCellIndex,
    updateShift
}) {
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        let className = activeShiftList[rosterInfo.previousMonthShiftList[i]].cssClassName;
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={"prev-" + i}
                shift={rosterInfo.previousMonthShiftList[i]} />)
    }
    calendarDateList.forEach((calendarDate, i) => {
        let className = '';
        if (activeShiftList[rosterInfo.shiftList[i + 1]] !== undefined) {
            className = activeShiftList[rosterInfo.shiftList[i + 1]].cssClassName;
        }
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                editable
                key={itoId + '_' + i}
                setIsHighLightRow={setIsHighLightRow}
                updateHighLightCellIndex={updateHighLightCellIndex}
                onBlur={(e) => { updateShift(itoId, calendarDate.dateOfMonth, e.target.textContent) }}
                shift={rosterInfo.shiftList[i + 1]} />)
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