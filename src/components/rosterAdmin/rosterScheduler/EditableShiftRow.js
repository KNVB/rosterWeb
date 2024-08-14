import EditableShiftCell from "./EditableShiftCell";
import NameCell from "../../common/cells/NameCell";
import ShiftCell from "../../common/cells/ShiftCell";
import StatCell from "../../common/cells/StatCell";
export default function EditableShiftRow({ calendarDateList, itoId, previousMonthShiftList, rosterRow, rowIndex, systemParam, uiAction }) {
    let className = '', shift = '', shiftCellList = [];
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
        shift = rosterRow.shiftList[index + 1];
        console.log(shift);
        shiftCellList.push(
            <EditableShiftCell
                key={itoId + '_' + index}
                title={shift}
                uiAction={uiAction}>
                {shift}
            </EditableShiftCell>
        );
    });
    return (
        <tr id={"rosterRow_" + itoId}>
            <NameCell isHighLightRow={uiAction.isHighLightRow(rowIndex)}>
                {rosterRow.itoName}
                <br />
                {rosterRow.itoPostName} Extn. 2458
            </NameCell>
            {shiftCellList}
            <StatCell>
                {rosterRow.expectedWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterRow.actualWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterRow.lastMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterRow.thisMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterRow.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterRow.shiftCountList.aShiftCount}
            </StatCell>
            <StatCell>
                {rosterRow.shiftCountList.bxShiftCount}
            </StatCell>
            <StatCell>
                {rosterRow.shiftCountList.cShiftCount}
            </StatCell>
            <StatCell>
                {rosterRow.shiftCountList.dxShiftCount}
            </StatCell>
            <StatCell>
                {rosterRow.actualWorkingDayCount}
            </StatCell>
        </tr>
    )
}