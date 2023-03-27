import EditableShiftCell from "../EditableShiftCell";
import NameCell from "../../../cells/NameCell";
import ShiftCell from "../../../cells/ShiftCell";
import StatCell from "../../../cells/StatCell";
export default function PreferredShiftRow(props) {
    let {
        calendarDateList,
        itoId,
        rosterDataUtil, rowIndex,
        systemParam,
        uiAction } = props;
    let className = '';
    let rosterDetail = rosterDataUtil.getRosterList(itoId);
    let shiftCellList = [];
    let handleBlurEvent = (itoId, dateOfMonth, newPreferredShift) => {
        rosterDataUtil.updatePreferredShift(itoId, dateOfMonth, newPreferredShift);
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
                cssClassName={className.join(" ")}
                key={"preferred_" + itoId + '_' + i}
                onBlur={(e) => handleBlurEvent(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onPaste={(e) => uiAction.paste(calendarDate.dateOfMonth, e)}
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