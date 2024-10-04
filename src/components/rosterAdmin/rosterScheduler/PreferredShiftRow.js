import ITOShiftCell from "./ITOShiftCell";
import NameCell from "../../common/cells/NameCell";
import ShiftCell from "../../common/cells/ShiftCell";
import StatCell from "../../common/cells/StatCell";
export default function PreferredShiftRow({ calendarDateList, dataAction, eventHandler, itoId, preferredShiftList, rowIndex, systemParam, uiAction }) {
    let className = '';
    let preferredShift = '', shiftCellList = [];
   
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    calendarDateList.forEach((calendarDate, index) => {
        className = uiAction.getSelectedCssClass(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if (preferredShiftList) {
            preferredShift = preferredShiftList[index + 1];
        } else {
            preferredShift = '';
        }

        shiftCellList.push(
            <ITOShiftCell
                cssClassName={className.join(" ")}
                eventHandler={eventHandler}
                key={itoId + '_' + index}
                keyDownHandler={eventHandler.handleKeyDownEvent}
                onBlur={e => dataAction.updatePreferredShift(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onPaste={e => eventHandler.handlePaste(e, calendarDate.dateOfMonth)}>
                {preferredShift}
            </ITOShiftCell>
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
            <td className='borderCell' colSpan={6}>
            </td>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
        </tr>
    );
}