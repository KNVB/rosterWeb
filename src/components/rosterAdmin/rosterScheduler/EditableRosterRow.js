import EditableShiftCell from './EditableShiftCell';
import NameCell from '../../cells/NameCell';
import ShiftCell from "../../cells/ShiftCell";
import StatCell from '../../cells/StatCell';
export default function EditableRosterRow({ itoId, maxRowCount, minRowCount, rosterDataAction, rosterDataList, rowIndex, uiAction }) {
    let activeShiftList = rosterDataList.activeShiftList;
    let calendarDateList = rosterDataList.monthlyCalendar.calendarDateList;
    let isHighLightRow = (uiAction.getHighLightRowIndex() === rowIndex);
    let rosterInfo = rosterDataList.rosterList[itoId];
    let shiftCellList = [];
    let systemParam = rosterDataList.systemParam;
    let handleBlurEvent = (itoId, dateOfMonth, newShift) => {
        rosterDataAction.updateShift(itoId, dateOfMonth, newShift);
    }
    let handleArrowKeyEvent = (e, yOffset, xOffset) => {
        e.preventDefault();
        let cell, nextCell, nextCellIndex, nextRow, nextRowIndex, table, row;
        cell = e.target.closest("td");
        row = cell.closest("tr");
        table = row.closest("table");
        switch (true) {
            case (yOffset > 0):
                nextRow=table.rows[row.rowIndex+1];
                break;
        }
        console.log(nextRow)
        /*
        switch (true) {
            case (xOffset < 0):
                nextCell = cell.previousSibling;
                break;
            case (xOffset > 0):
                nextCell = cell.nextSibling;
                break
            default:
                nextCell = cell;
                break;
        }
        switch (true) {
            case (nextCell.cellIndex < (systemParam.noOfPrevDate + 1)):
                nextCellIndex = systemParam.noOfPrevDate + calendarDateList.length;
                break;
            case (nextCell.cellIndex > (systemParam.noOfPrevDate + calendarDateList.length)):
                nextCellIndex = systemParam.noOfPrevDate + 1;
                break;
            default:
                nextCellIndex = nextCell.cellIndex;
                break;
        }
        nextCell = table.rows[nextRowIndex].cells[nextCellIndex];
        selectCell(nextCell);
        */
    }
    function handleTabKeyEvent(e) {
        console.log("Tab event");
        if (e.shiftKey) {
            handleArrowKeyEvent(e, 0, -1);
        } else {
            handleArrowKeyEvent(e, 0, 1);
        }
    }
    let handleKeyDown = (e) => {
        switch (e.which) {
            case 9://handle tab key
                handleTabKeyEvent(e);
                break;
            case 38://handle up arrow key event
                handleArrowKeyEvent(e, -1, 0);
                break;
            case 40://handle down arrow key event
                handleArrowKeyEvent(e, 1, 0);
                break;
            default:
                break;
        }
    }
    let selectCell = cell => {
        let nextShiftType = cell.querySelector("div.shiftType");
        let range = document.createRange();
        let sel = window.getSelection();
        range.selectNodeContents(nextShiftType);
        sel.removeAllRanges();
        sel.addRange(range);
        uiAction.select(cell.cellIndex, rowIndex);
    }
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        let className = '';
        let shift = '';
        if (rosterInfo.previousMonthShiftList[i] !== undefined) {
            className = activeShiftList[rosterInfo.previousMonthShiftList[i]].cssClassName;
            shift = rosterInfo.previousMonthShiftList[i];
        }
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={"prev-" + i}>
                {shift}
            </ShiftCell>
        )
    }
    calendarDateList.forEach((calendarDate, i) => {
        let className = uiAction.getSelectedClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if (rosterDataList.allITOStat.duplicatShiftList[itoId].includes(calendarDate.dateOfMonth)) {
            className += " errorRedBlackGround";
        } else {
            if (activeShiftList[rosterInfo.shiftList[i + 1]]) {
                className += " " + activeShiftList[rosterInfo.shiftList[i + 1]].cssClassName;
            }
        }
        shiftCellList.push(
            <EditableShiftCell
                cssClassName={className}
                key={itoId + '_' + i}
                onBlur={(e) => handleBlurEvent(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                onKeyDown={handleKeyDown}
                uiAction={uiAction}>
                {rosterInfo.shiftList[i + 1]}
            </EditableShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={itoId + '_' + i}>&nbsp;</ShiftCell>)
    }
    return (
        <tr>
            <NameCell border isHighLight={isHighLightRow}>
                {rosterInfo.itoName}
                <br />
                {rosterInfo.itoPostName} Extn. 2458
            </NameCell>
            {shiftCellList}
            <StatCell>
                {rosterInfo.expectedWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterInfo.actualWorkingHour.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterInfo.lastMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterInfo.thisMonthBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterInfo.totalBalance.toFixed(2)}
            </StatCell>
            <StatCell>
                {rosterInfo.shiftCountList.aShiftCount}
            </StatCell>
            <StatCell>
                {rosterInfo.shiftCountList.bxShiftCount}
            </StatCell>
            <StatCell>
                {rosterInfo.shiftCountList.cShiftCount}
            </StatCell>
            <StatCell>
                {rosterInfo.shiftCountList.dxShiftCount}
            </StatCell>
            <StatCell>
                {rosterInfo.actualWorkingDayCount}
            </StatCell>
        </tr>
    )
}