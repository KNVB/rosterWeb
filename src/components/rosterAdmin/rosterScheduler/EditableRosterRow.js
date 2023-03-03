import EditableShiftCell from './util/EditableShiftCell';
import NameCell from '../../cells/NameCell';
import ShiftCell from '../../cells/ShiftCell';
import StatCell from '../../cells/StatCell';
export default function EditableRosterRow({
    activeShiftList,
    allITOStat,
    calendarDateList,
    getSelectedClassName,
    itoId,
    isHighLightRow,
    rosterInfo,
    startSelect,
    systemParam,
    updateShift,
    updateUI
}) {
    function handleMouseDownEvent(e) {
        let cell = e.target.closest("td");
        let row = cell.closest('tr');
        startSelect(cell.cellIndex, row.rowIndex);
    }
    function handleMouseEnterEvent(e) {
        let cell = e.target.closest("td");
        let row = cell.closest('tr');
        updateUI(cell.cellIndex, row.rowIndex);
    }
    function handleMouseLeaveEvent(e) {
        updateUI(-1, -1);
    }
    let shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        let className = '';
        let shift = '';
        if (rosterInfo.previousMonthShiftList[i] !== undefined) {
            className = activeShiftList[rosterInfo.previousMonthShiftList[i]].cssClassName;
            shift = rosterInfo.previousMonthShiftList[i];
        }
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={"prev-" + i}>
                {shift}
            </ShiftCell>
        )
    }
    calendarDateList.forEach((calendarDate, i) => {
        let className = '', temp;
        if (i === 0) {
            if (allITOStat.duplicatShiftList[itoId].includes(calendarDate.dateOfMonth)) {
                className += " errorRedBlackGround";
            } else {
                if (activeShiftList[rosterInfo.shiftList[i + 1]] !== undefined) {
                    temp = getSelectedClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, i * 2 + 5);
                    if (temp !== '') {
                        className += temp;
                    } else {
                        className += " " + activeShiftList[rosterInfo.shiftList[i + 1]].cssClassName;
                    }
                }
            }
            console.log(className, temp)
            shiftCellList.push(
                <EditableShiftCell
                    cssClassName={className}
                    key={itoId + '_' + i}
                    onBlur={(e) => { updateShift(itoId, calendarDate.dateOfMonth, e.target.textContent) }}
                    onMouseDown={handleMouseDownEvent}
                    onMouseEnter={handleMouseEnterEvent}
                    onMouseLeave={handleMouseLeaveEvent}>
                    {rosterInfo.shiftList[i + 1]}
                </EditableShiftCell>
            );
        }
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={itoId + '_' + i}>&nbsp;</ShiftCell>)
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