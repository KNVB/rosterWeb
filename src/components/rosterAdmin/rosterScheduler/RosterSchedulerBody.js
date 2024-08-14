import EditableShiftRow from "./EditableShiftRow";
import PreferredShiftRow from "./PreferredShiftRow";
export default function RosterSchedulerBody({ calendarDateList, preferredShiftList, previousMonthShiftList, roster, systemParam, uiAction }) {
    let rowList = [];
    let itoIdList = Object.keys(roster.rosterRow);
    console.log(roster.rosterRow)
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <EditableShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                previousMonthShiftList={previousMonthShiftList[itoId]}
                rosterRow={roster.rosterRow[itoId]}
                key={"editableShiftRow_" + itoId}
                rowIndex={(index * 2 + 5)}
                systemParam={systemParam}
                uiAction={uiAction} />
        );
        rowList.push(
            <PreferredShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                preferredShiftList={preferredShiftList[itoId]}
                rosterRow={roster.rosterRow[itoId]}
                key={"preferredShiftRow_" + itoId}
                rowIndex={(index * 2 + 5)}
                systemParam={systemParam}
                uiAction={uiAction} />
        );
    });
    return (
        <tbody>
            {rowList}
        </tbody>
    );
}