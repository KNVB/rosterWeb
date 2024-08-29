import EditableShiftCell from "./EditableShiftCell";
import NameCell from "../../common/cells/NameCell";
import ShiftCell from "../../common/cells/ShiftCell";
import StatCell from "../../common/cells/StatCell";
import TimeOff from "./timeOff/TimeOff";
export default function PreferredShiftRow({ calendarDateList, itoId, preferredShiftList, rowIndex, systemParam, timeOffList, uiAction }) {
    let className = '';
    let preferredShift = '', shiftCellList = [];
    
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
   
    calendarDateList.forEach((calendarDate, i) => {
        preferredShift = "";
        className = uiAction.getPreferredShiftCellCssClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if (preferredShiftList && (preferredShiftList[calendarDate.dateOfMonth] !== undefined)) {
            preferredShift = preferredShiftList[calendarDate.dateOfMonth];
        }
        shiftCellList.push(
            <EditableShiftCell
                cssClassName={className.join(" ")}
                key={"preferred_" + itoId + '_' + i}
                onBlur={(e) => uiAction.updatePreferredShift(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onPaste={(e) => uiAction.pasteRosterData(calendarDate.dateOfMonth, e)}
                uiAction={uiAction}>
                {preferredShift}
            </EditableShiftCell>
        );
    });    
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={"preferred_" + itoId + '_' + i} />);
    }
    return (
        <tr id={"preferredShiftRow_" + itoId}>
            <NameCell isHighLightRow={uiAction.isHighLightRow(rowIndex)}>
                Preferred Shift
            </NameCell>
            {shiftCellList}
            <td className='borderCell' colSpan={5}>              
            </td>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
        </tr>
    );
}