import NameCell from '../../cells/NameCell';
import ShiftCell from '../../cells/ShiftCell';
import StatCell from '../../cells/StatCell';
export default function VacantShiftRow({calendarDateList,rosterList,systemParam}){
    let shiftCellList = [];    
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        shiftCellList.push(<ShiftCell key={"prev-preferred-" + i} />)
    }
    console.log(rosterList);
    return(
        <tr>
            <td className="border text-end vacantShiftLabel">Vacant Shifts</td>
            {shiftCellList}
        </tr>
    )
}