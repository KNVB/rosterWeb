import EditableShiftCell from "./EditableShiftCell";
import NameCell from "../../common/cells/NameCell";
import ShiftCell from "../../common/cells/ShiftCell";
import StatCell from "../../common/cells/StatCell";
export default function EditableShiftRow({ calendarDateList, itoId, previousMonthShiftList, roster, rowIndex, systemParam, timeOff, uiAction }) {
    let className = '';
    let shift = '', shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        className = '';
        shift = '';
        if (previousMonthShiftList && (previousMonthShiftList[i] !== undefined)) {
            shift = previousMonthShiftList[i];
            className = uiAction.getShiftCssClassName(shift);
        }
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={"prev-" + i}>
                {shift}
            </ShiftCell>
        )
    }
    calendarDateList.forEach((calendarDate, index) => {
        shift = roster.shiftList[index + 1];
        className = uiAction.getEditableShiftCellCssClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex, shift);
        shiftCellList.push(
            <EditableShiftCell
                cssClassName={className.join(" ")}
                key={itoId + '_' + index}
                onBlur={(e) => uiAction.updateShift(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onPaste={(e) => uiAction.pasteRosterData(calendarDate.dateOfMonth, e)}
                title={shift}
                uiAction={uiAction}>
                {shift}
            </EditableShiftCell>
        );

    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={itoId + '_' + i}>&nbsp;</ShiftCell>)
    }
    return (
        <tr id={"rosterRow_" + itoId}>
            <NameCell isHighLightRow={uiAction.isHighLightRow(rowIndex)}>
                {roster.itoName}
                <br />
                {roster.itoPostName} Extn. 2458
            </NameCell>
            {shiftCellList}
            <StatCell>
                {roster.expectedWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.actualWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.lastMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.thisMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                <div
                    className={(timeOff.total === 0) ? null : "timeOff"}
                    onClick={() => uiAction.showTimeOff(itoId)}
                    title="Show Time off record">
                    {timeOff.total}
                </div>
            </StatCell>
            <StatCell>
                {roster.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.aShiftCount}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.bxShiftCount}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.cShiftCount}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.dxShiftCount}
            </StatCell>
            <StatCell>
                {roster.actualWorkingDayCount}
            </StatCell>
        </tr>
    )
}