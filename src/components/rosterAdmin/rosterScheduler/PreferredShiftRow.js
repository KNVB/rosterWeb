import EditableShiftCell from './util/EditableShiftCell';
import NameCell from '../../cells/NameCell';
import ShiftCell from '../../cells/ShiftCell';
import StatCell from '../../cells/StatCell';

export default function PreferredShiftRow({
    calendarDateList,
    itoId,
    isHighLightRow,
    rosterInfo,
    systemParam,
    updatePreferredShift,
    updateUI }) {

    let shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    function handleMouseLeaveEvent(e) {
        updateUI(-1, -1);
    }
    function handleMouseEnterEvent(e) {
        let cell = e.target.closest("td");
        let row = cell.closest('tr');
        updateUI(cell.cellIndex, row.rowIndex);
    }
    calendarDateList.forEach((calendarDate, i) => {
        let preferredShift = "";
        if (rosterInfo.preferredShiftList) {
            preferredShift = (rosterInfo.preferredShiftList[i + 1]);
        }
        shiftCellList.push(
            <EditableShiftCell
                cssClassName="cursor-cell"
                key={"preferred_" + itoId + '_' + i}
                onBlur={(e) => { updatePreferredShift(itoId, calendarDate.dateOfMonth, e.target.textContent) }}
                onMouseEnter={handleMouseEnterEvent}
                onMouseLeave={handleMouseLeaveEvent}>
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