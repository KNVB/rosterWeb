import EditableShiftRow from "./EditableShiftRow";
export default function RosterSchedulerBody({ calendarDateList,preferredShiftList,previousMonthShiftList, roster, systemParam, uiAction }) {
    let itoIdList = Object.keys(roster.rosterRow);
    let rowList = [];
    console.log(roster);    
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <EditableShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                previousMonthShiftList={previousMonthShiftList[itoId]}
                rowIndex={(index + 5)}
                roster={roster.rosterRow[itoId]}                
                systemParam={systemParam}
                uiAction={uiAction}
            />
        );
    });
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}