import EditableShiftCell from './EditableShiftCell';
import NameCell from '../../cells/NameCell';
import ShiftCell from "../../cells/ShiftCell";
import StatCell from '../../cells/StatCell';
export default function EditableRosterRow({itoId, rosterDataAction,rosterDataList, uiAction }){
    let activeShiftList=rosterDataList.activeShiftList;
    let calendarDateList=rosterDataList.monthlyCalendar.calendarDateList;
    let isHighLightRow=(uiAction.getHighLightRowIndex() === itoId);
    let rosterInfo = rosterDataList.rosterList[itoId];
    let shiftCellList = [];    
    let systemParam = rosterDataList.systemParam;
    let handleFocus=e=>{
        let cell = e.target.closest("td");
        uiAction.updateFocus(cell.cellIndex, itoId);
    }
    function handleMouseDownEvent(e) {
        let cell = e.target.closest("td");        
        uiAction.startSelect(cell.cellIndex, itoId);
    }
    function handleMouseEnterEvent(e) {
        let cell = e.target.closest("td");
        uiAction.updateUI(cell.cellIndex, itoId);
    }
    function handleMouseLeaveEvent(e) {
        uiAction.updateUI(-1, -1);
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
        let className='';
        if (rosterDataList.allITOStat.duplicatShiftList[itoId].includes(calendarDate.dateOfMonth)) {
            className += " errorRedBlackGround";
        } else {
            className += " " + activeShiftList[rosterInfo.shiftList[i + 1]].cssClassName;            
        }
        shiftCellList.push(
            <EditableShiftCell
                cssClassName={className}
                key={itoId + '_' + i}
                onBlur={(e) => { rosterDataAction.updateShift(itoId, calendarDate.dateOfMonth, e.target.textContent) }}
                onFocus={handleFocus}
                onMouseDown={handleMouseDownEvent}
                onMouseEnter={handleMouseEnterEvent}
                onMouseLeave={handleMouseLeaveEvent}>
                {rosterInfo.shiftList[i + 1]}
            </EditableShiftCell>
        );
    });
    for (let i = calendarDateList.length; i < 31; i++) {
        shiftCellList.push(<ShiftCell key={itoId + '_' + i}>&nbsp;</ShiftCell>)
    }
    return(
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