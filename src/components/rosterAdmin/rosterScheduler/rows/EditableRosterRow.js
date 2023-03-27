import EditableShiftCell from "../EditableShiftCell";
import NameCell from "../../../cells/NameCell";
import ShiftCell from "../../../cells/ShiftCell";
import StatCell from "../../../cells/StatCell";

export default function EditableRosterRow({ calendarDateList, itoId, rosterDataUtil, rowIndex, systemParam, uiAction }) {
    let className = '';
    let rosterDetail = rosterDataUtil.getRosterList(itoId);
    let shift = '', shiftCellList = [], temp;
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        className = '';
        shift = '';
        if (rosterDetail.previousMonthShiftList[i] !== undefined) {
            shift = rosterDetail.previousMonthShiftList[i];
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
        shift = rosterDetail.shiftList[index + 1];
        className = uiAction.getEditableShiftCellCssClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex, shift);
        if (rosterDataUtil.isDuplicateShift(itoId, calendarDate.dateOfMonth)) {
            className.push("errorRedBlackGround");
        }
        shiftCellList.push(
            <EditableShiftCell
                cssClassName={className.join(" ")}
                key={itoId + '_' + index}
                onBlur={(e) => uiAction.updateShift(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onPaste={(e) => uiAction.paste(calendarDate.dateOfMonth, e)}
                uiAction={uiAction}>
                {shift}
            </EditableShiftCell>
        )
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={itoId + '_' + i}>&nbsp;</ShiftCell>)
    }

    return (
        <tr id={"rosterRow_" + itoId}>
            <NameCell isHighLightRow={uiAction.isHighLightRow(rowIndex)}>
                {rosterDetail.itoName}
                <br />
                {rosterDetail.itoPostName} Extn. 2458
            </NameCell>
            {shiftCellList}
            <StatCell>
                {rosterDetail.expectedWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.actualWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.lastMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.thisMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.aShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.bxShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.cShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.dxShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.actualWorkingDayCount}
            </StatCell>
        </tr>
    )
}