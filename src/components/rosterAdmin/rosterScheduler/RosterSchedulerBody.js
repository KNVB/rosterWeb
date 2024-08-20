import EditableShiftRow from "./EditableShiftRow";
import PreferredShiftRow from "./PreferredShiftRow";
export default function RosterSchedulerBody({ calendarDateList,preferredShiftList,previousMonthShiftList, roster, systemParam, uiAction }) {
    let itoIdList = Object.keys(roster.rosterRow);
    let rowList = [];
    //console.log(roster);    
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <EditableShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                previousMonthShiftList={previousMonthShiftList[itoId]}
                rowIndex={(index*2 + 5)}
                roster={roster.rosterRow[itoId]}                
                systemParam={systemParam}
                uiAction={uiAction}
            />
        );
        rowList.push(
            <PreferredShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"preferredShiftRow_" + itoId}
                preferredShiftList={preferredShiftList[itoId]}
                rowIndex={(index*2 + 6)}
                systemParam={systemParam}
                uiAction={uiAction}/> 
        )
    });
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}