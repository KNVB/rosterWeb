import { useState } from 'react';
import NameCell from '../../cells/NameCell';
import ShiftCell from '../../cells/ShiftCell';
import StatCell from '../../cells/StatCell';

export default function PreferredShiftRow({
    calendarDateList,
    itoId,
    rosterInfo,
    systemParam,
    updateHighLightCellIndex }) {
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    calendarDateList.forEach((calendarDate, i) => {
        let preferredShift = (rosterInfo.preferredShiftList[i + 1]);
        shiftCellList.push(
            <ShiftCell
                editable
                key={"preferred_" + itoId + '_' + i}
                setIsHighLightRow={setIsHighLightRow}
                updateHighLightCellIndex={updateHighLightCellIndex}
                shift={preferredShift} />
        )
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
            <td className='border' colSpan={5}></td>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
            <StatCell></StatCell>
        </tr>
    );
}