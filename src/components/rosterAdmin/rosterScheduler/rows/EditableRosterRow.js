import EditableShiftCell from "../EditableShiftCell";
import NameCell from "../../../common/cells/NameCell";
import ShiftCell from "../../../common/cells/ShiftCell";
import StatCell from "../../../common/cells/StatCell";

export default function EditableRosterRow({ calendarDateList, itoId, roster, rosterSchedulerData, rowIndex, systemParam, uiAction }) {
    let className = '', previousMonthShiftList = rosterSchedulerData.previousMonthShiftList[itoId];
    let rosterDetail = roster.rosterRow[itoId];
    let shift = '', shiftCellList = [];
    // console.log(itoId,previousMonthShiftList);
    for (let i = systemParam.maxConsecutiveWorkingDay - systemParam.noOfPrevDate; i < systemParam.maxConsecutiveWorkingDay; i++) {
        className = '';
        shift = '';
        if (previousMonthShiftList && (previousMonthShiftList[i] !== undefined)) {
            shift = previousMonthShiftList[i];
            className = uiAction.getShiftCssClassName(shift);
        }
        shiftCellList.push(
            <ShiftCell
                cssClassName={className}
                key={"prev-" + i}>
                {shift}
            </ShiftCell>
        )
    }
   
    let ito = rosterSchedulerData.activeITOList[itoId];
    let leaveDate = new Date(ito.leaveDate);
    let joinDate = new Date(ito.joinDate);
    calendarDateList.forEach((calendarDate, index) => {
        let theDate = index + 1;
        let theDateObj = new Date(roster.year + "-" + roster.month + "-" + theDate);
        shift = rosterDetail.shiftList[theDate];

        if ((theDateObj >= joinDate) && (theDateObj <= leaveDate)) {
            className = uiAction.getEditableShiftCellCssClassName(calendarDate.dateOfMonth + systemParam.noOfPrevDate, rowIndex, shift);
            if (uiAction.isDuplicateShift(itoId, calendarDate.dateOfMonth)) {
                className.push("errorRedBlackGround");
            }
            shiftCellList.push(
                <EditableShiftCell
                    cssClassName={className.join(" ")}
                    key={itoId + '_' + index}
                    onBlur={(e) => uiAction.updateShift(itoId, calendarDate.dateOfMonth, e.target.textContent)}
                    onPaste={(e) => uiAction.pasteRosterData(calendarDate.dateOfMonth, e)}
                    uiAction={uiAction}>
                    {shift}
                </EditableShiftCell>
            );
        } else {
            shiftCellList.push(<ShiftCell cssClassName="disabled" key={itoId + '_' + index}>&nbsp;</ShiftCell>)
        }

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
    );
}