import ITOShiftCell from "./ITOShiftCell";
import NameCell from "../../common/cells/NameCell";
import ShiftCell from "../../common/cells/ShiftCell";
import StatCell from "../../common/cells/StatCell";
export default function PreferredShiftRow({ calendarDateList, dataAction, itoId, preferredShiftList, rowIndex, systemParam, uiAction }) {
    let className = '';
    let preferredShift = '', shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    calendarDateList.forEach((calendarDate, index) => {
        className = uiAction.getSelectedCssClass(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if (preferredShiftList){
            preferredShift = preferredShiftList[index + 1];
        }else {
            preferredShift = '';
        }
        
        shiftCellList.push(
            <ITOShiftCell
                cssClassName={className.join(" ")}
                key={itoId + '_' + index}                
                uiAction={uiAction}>
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