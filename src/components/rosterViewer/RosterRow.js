import NameCell from "../common/cells/NameCell";
import ShiftCell from "../common/cells/ShiftCell";
import StatCell from "../common/cells/StatCell";
export default function RosterRow({calendarDateList,itoId,roster, rowIndex,systemParam,uiAction}){
    let className = "";
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
        shift = roster.shiftList[index + 1];
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
                {roster.itoName}
                <br />
                {roster.itoPostName} Extn. 2458
            </NameCell>
            {shiftCellList}
            <StatCell>
                {roster.expectedWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.actualWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.lastMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.thisMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.aShiftCount}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.bxShiftCount}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.cShiftCount}
            </StatCell>
            <StatCell>
                {roster.shiftCountList.dxShiftCount}
            </StatCell>
            <StatCell>
                {roster.actualWorkingDayCount}
            </StatCell>
        </tr>
    );
}