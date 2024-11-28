import ITOShiftCell from "./ITOShiftCell";
import NameCell from "../../common/cells/NameCell";
import ShiftCell from "../../common/cells/ShiftCell";
import StatCell from "../../common/cells/StatCell";
export default function ITOShiftRow({ calendarDateList, dataAction, eventHandler, itoId, previousMonthShiftList, nonStandardWorkingHour, roster, rowIndex, systemParam, rosterSchedulerTableUtil }) {
    let className = '';
    let shift = '', shiftCellList = [];
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        className = '';
        shift = '';
        if (previousMonthShiftList && (previousMonthShiftList[i] !== undefined)) {
            shift = previousMonthShiftList[i];
            className = dataAction.getShiftCssClassName(shift);
        }
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={"prev-" + i}
                title={shift}>
                {shift}
            </ShiftCell>
        )
    }
    calendarDateList.forEach((calendarDate, index) => {
        shift = roster.shiftList[index + 1];
        className = rosterSchedulerTableUtil.getSelectedCssClass(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex);
        if (dataAction.isDuplicateShift(index + 1, itoId)) {
            className.push("errorRedBlackGround");
        } else {
            className.push(dataAction.getShiftCssClassName(shift));
        }
        shiftCellList.push(
            <ITOShiftCell
                cssClassName={className.join(" ")}
                eventHandler={eventHandler}
                key={itoId + '_' + index}
                keyDownHandler={eventHandler.handleKeyDownEvent}
                onBlur={e => dataAction.updateShiftFromTable(itoId, index + 1, e.target.textContent)}
                onPaste={e => eventHandler.handlePaste(e, calendarDate.dateOfMonth)}
            >
                {shift}
            </ITOShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={itoId + '_' + i}>&nbsp;</ShiftCell>)
    }
    return (
        <tr id={"rosterRow_" + itoId}>
            <NameCell isHighLightRow={rosterSchedulerTableUtil.isHighLightRow(rowIndex)}>
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
                {nonStandardWorkingHour.toFixed(2)}
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