import NameCell from "../common/cells/NameCell";
import ShiftCell from "../common/cells/ShiftCell";
import StatCell from "../common/cells/StatCell";
export default function RosterRow({ calendarDateList, dataAction, itoId, roster, rowIndex, uiAction }) {
    let className = "";
    let shiftCellList = [];
    //console.log(roster);
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
    function showShift(e, date) {
        e.preventDefault();
        dataAction.showShiftDetail(itoId, date);
    }
    calendarDateList.forEach((calendarDate, index) => {
        let shift;
        let itemList = structuredClone(roster.shiftList[index + 1]);
        if (itemList === undefined) {
            shift = "";
        } else {
            let temp=[];
            itemList.forEach(item=>{
                temp.push(item.shiftType);
            });
            shift=temp.join("+");
        }
        
        className = "cursor-pointer " + dataAction.getShiftCssClassName(shift);
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={itoId + '_' + index}
                onContextMenu={e => showShift(e, calendarDate.dateOfMonth)}
                onMouseEnter={handleMouseEnterEvent}
                onMouseLeave={handleMouseLeaveEvent}
                title="Right Click to Show Shift Detail">
                <div className="m-0 p-0">
                    {shift}
                </div>
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
                {roster.extraHour}
            </StatCell>
            <StatCell>
                {roster.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {roster.aShiftCount}
            </StatCell>
            <StatCell>
                {roster.bxShiftCount}
            </StatCell>
            <StatCell>
                {roster.cShiftCount}
            </StatCell>
            <StatCell>
                {roster.dxShiftCount}
            </StatCell>
            <StatCell>
                {roster.actualWorkingDayCount}
            </StatCell>
        </tr>
    );
}