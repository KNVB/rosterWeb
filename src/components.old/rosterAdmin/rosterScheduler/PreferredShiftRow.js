import EditableShiftCell from './EditableShiftCell';
import NameCell from '../../cells/NameCell';
import ShiftCell from '../../cells/ShiftCell';
import StatCell from '../../cells/StatCell';
export default function PreferredShiftRow({ itoId, rosterDataAction, rosterDataList, rowIndex, uiAction }) {
    let calendarDateList = rosterDataList.monthlyCalendar.calendarDateList;
    let isHighLightRow = (uiAction.getHighLightRowIndex() === rowIndex);
    let rosterInfo = rosterDataList.rosterList[itoId];
    let shiftCellList = [];
    let systemParam = rosterDataList.systemParam;
    let handleBlurEvent=(itoId, dateOfMonth, newPreferredShift)=>{
        rosterDataAction.updatePreferredShift(itoId, dateOfMonth, newPreferredShift);
    }
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    calendarDateList.forEach((calendarDate, i) => {
        let preferredShift = "";
        let className = "cursor-cell";
        className += " " + uiAction.getSelectedClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if (rosterInfo.preferredShiftList) {
            preferredShift = (rosterInfo.preferredShiftList[i + 1]);
        }
        shiftCellList.push(
            <EditableShiftCell
                cssClassName={className}
                key={"preferred_" + itoId + '_' + i}
                onBlur={(e) => handleBlurEvent(itoId, calendarDate.dateOfMonth, e.target.textContent) }
                uiAction={uiAction}>
                {preferredShift}
            </EditableShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={"preferred_" + itoId + '_' + i} />)
    }
    return (
        <tr>
            <NameCell border isHighLight={isHighLightRow}>
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