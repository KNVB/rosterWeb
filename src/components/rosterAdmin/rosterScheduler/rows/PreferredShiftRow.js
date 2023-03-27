import EditableShiftCell from "../cells/EditableShiftCell";
import NameCell from "../../cells/NameCell";
import ShiftCell from "../../cells/ShiftCell";
import StatCell from "../../cells/StatCell";
export default function PreferredShiftRow(props) {
    let {
        itoId,
        rosterData, rosterDataAction, rowIndex,
        uiAction } = props;
    let calendarDateList = rosterData.monthlyCalendar.calendarDateList;
    let className = '';
    let rosterDetail = rosterData.rosterList[itoId];
    let shiftCellList = [];
    let systemParam = rosterData.systemParam;
    let handleBlurEvent = (itoId, dateOfMonth, newPreferredShift) => {
        rosterDataAction.updatePreferredShift(itoId, dateOfMonth, newPreferredShift);
    }
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    calendarDateList.forEach((calendarDate, i) => {
        let preferredShift = "";
        className = uiAction.getPreferredShiftCellCssClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if (rosterDetail.preferredShiftList) {
            preferredShift = (rosterDetail.preferredShiftList[i + 1]);
        }

        shiftCellList.push(
            <EditableShiftCell
                cssClassName={className}
                key={"preferred_" + itoId + '_' + i}
                onBlur={(e) => handleBlurEvent(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onPaste={(e) => rosterDataAction.paste(calendarDate.dateOfMonth, e)}
                uiAction={uiAction}>
                {preferredShift}
            </EditableShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={"preferred_" + itoId + '_' + i} />)
    }
    return (
        <tr id={"preferredShiftRow_" + itoId}>
            <NameCell isHighLightRow={uiAction.isHighLightRow(rowIndex)}>
                Preferred Shift
            </NameCell>
            {shiftCellList}
            <td className='borderCell' colSpan={5}></td>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
        </tr>
    );
}