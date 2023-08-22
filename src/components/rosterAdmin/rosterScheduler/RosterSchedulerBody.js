import EditableRosterRow from "./rows/EditableRosterRow";
import PreferredShiftRow from "./rows/PreferredShiftRow";
import VacantShiftRow from "./rows/VacantShiftRow";
export default function RosterSchedulerBody({ roster, rosterMonth, rosterSchedulerData, systemParam, uiAction }){
    let rowList = [];
    let itoIdList = Object.keys(roster.rosterRow);
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <EditableRosterRow
                calendarDateList={rosterMonth.calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                roster={roster}
                rosterSchedulerData={rosterSchedulerData}
                rowIndex={(index * 2 + 5)}
                systemParam={systemParam}
                uiAction={uiAction} />
        );
        rowList.push(
            <PreferredShiftRow
                calendarDateList={rosterMonth.calendarDateList}
                itoId={itoId}
                key={"preferredShiftRow_" + itoId}
                roster={roster}
                rosterSchedulerData={rosterSchedulerData}
                rowIndex={(index * 2 + 6)}
                systemParam={systemParam}
                uiAction={uiAction} />
        );
    });
    return (
        <tbody>
            {rowList}
            <VacantShiftRow
                calendarDateList={rosterMonth.calendarDateList}
                rosterSchedulerData={rosterSchedulerData}
                systemParam={systemParam}
                uiAction={uiAction} />            
        </tbody>
    );        
}