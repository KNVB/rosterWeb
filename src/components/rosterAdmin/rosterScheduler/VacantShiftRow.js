import ShiftCell from '../../cells/ShiftCell';
import StatCell from '../../cells/StatCell';
export default function VacantShiftRow({ allITOStat, calendarDateList, systemParam }) {
    let shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-vacant-" + i} />)
    }
    calendarDateList.forEach(calendarDate => {
        if (allITOStat.vacantShiftList[calendarDate.dateOfMonth] !== undefined) {
            shiftCellList.push(<ShiftCell key={"vacant-" + (calendarDate.dateOfMonth-1)} shift={allITOStat.vacantShiftList[calendarDate.dateOfMonth]} />);
        } else {
            shiftCellList.push(<ShiftCell key={"vacant-" + (calendarDate.dateOfMonth-1)} />);
        }
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={'vacant-' + i} />)
    }
    //console.log(allITOStat);
    return (
        <tr>
            <td className="border text-end vacantShiftLabel">Vacant Shifts</td>
            {shiftCellList}
            <td className='borderCell' colSpan={5}></td>
            <StatCell>{allITOStat.aShiftStdDev}</StatCell>
            <StatCell>{allITOStat.bxShiftStdDev}</StatCell>
            <StatCell>{allITOStat.cShiftStdDev}</StatCell>
            <StatCell>{allITOStat.avgStdDev}</StatCell>
            <StatCell></StatCell>
        </tr>
    )
}