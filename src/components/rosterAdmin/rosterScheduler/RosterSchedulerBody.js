import EditableShiftRow from "./EditableShiftRow";
import PreferredShiftRow from "./PreferredShiftRow";
export default function RosterSchedulerBody({ calendarDateList, preferredShiftList, previousMonthShiftList, roster, systemParam, timeOffList, uiAction }) {
    let itoIdList = Object.keys(roster);
    let rowList = [];
    //console.log(roster);    
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <EditableShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                previousMonthShiftList={previousMonthShiftList[itoId]}
                rowIndex={uiAction.getRowIndex("rosterRow_" + itoId)}
                roster={roster[itoId]}
                systemParam={systemParam}
                timeOff={timeOffList[itoId]}
                uiAction={uiAction}
            />
        );
        rowList.push(
            <PreferredShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"preferredShiftRow_" + itoId}
                preferredShiftList={preferredShiftList[itoId]}
                rowIndex={uiAction.getRowIndex("preferredShiftRow_" + itoId)}
                systemParam={systemParam}
                uiAction={uiAction} />
        )
    });
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}