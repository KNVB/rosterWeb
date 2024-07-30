import NameCell from "../common/cells/NameCell";
import ShiftCell from "../common/cells/ShiftCell";
import StatCell from "../common/cells/StatCell";

export default function RosterRow({calendarDateList,itoId,roster, rowIndex,systemParam,uiAction}){
    let className = "";
    let rosterDetail = roster.rosterRow[itoId];
    let shift = '', shiftCellList = [];
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
    calendarDateList.forEach((calendarDate, index) => {
        shift = rosterDetail.shiftList[index + 1];
        className = uiAction.getShiftCssClassName(shift);
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={itoId + '_' + index}
                onMouseEnter={handleMouseEnterEvent}
                onMouseLeave={handleMouseLeaveEvent}
                title={shift}>
                {shift}
            </ShiftCell>
        )
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={itoId + '_' + i}>&nbsp;</ShiftCell>)
    }
    return (
        <tr id={"rosterRow_" + itoId}>
            <NameCell isHighLightRow={uiAction.isHighLightRow(rowIndex)}>
                {rosterDetail.itoName}
                <br />
                {rosterDetail.itoPostName} Extn. 2458
            </NameCell>
            {shiftCellList}
            <StatCell>
                {rosterDetail.expectedWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.actualWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.lastMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.thisMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.aShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.bxShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.cShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.shiftCountList.dxShiftCount}
            </StatCell>
            <StatCell>
                {rosterDetail.actualWorkingDayCount}
            </StatCell>
        </tr>
    )
}