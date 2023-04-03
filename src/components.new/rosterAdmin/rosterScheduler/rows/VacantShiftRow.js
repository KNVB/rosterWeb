import ShiftCell from '../../../cells/ShiftCell';
export default function VacantShiftRow({ rosterDataUtil, calendarDateList, systemParam, uiAction }) {
    function handleMouseEnterEvent(e) {
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        uiAction.updateUI(cell.cellIndex, rowIndex);
    }
    function handleMouseLeaveEvent(e) {
        e.preventDefault();
        uiAction.updateUI(-1, -1);
    }
    let shiftCellList = [], vacantShift;
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-vacant-" + i} />)
    }
    let vacantShiftList=rosterDataUtil.getVacantShiftList();
    //console.log(vacantShiftList);
    calendarDateList.forEach(calendarDate => {
        vacantShift = vacantShiftList[calendarDate.dateOfMonth];
        shiftCellList.push(
            <td
                className='borderCell shiftCell'
                onMouseEnter={handleMouseEnterEvent}
                onMouseLeave={handleMouseLeaveEvent}
                key={"vacant-" + (calendarDate.dateOfMonth - 1)}>
                {vacantShift}
            </td>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={'vacant-' + i} />)
    }
    //console.log(allITOStat);
    return (
        <tr>
            <td className="border text-end vacantShiftLabel">Vacant Shifts</td>
            {shiftCellList}
            <td className='borderCell' colSpan={10}></td>
        </tr>
    )
}