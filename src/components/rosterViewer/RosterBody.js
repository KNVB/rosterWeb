import RosterRow from "./RosterRow";
export default function RosterBody({roster,rosterMonth,systemParam,uiAction}){
    let itoIdList = Object.keys(roster.rosterRow);
    let rowList = [];
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <RosterRow
                calendarDateList={rosterMonth.calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                roster={roster}
                rowIndex={(index + 5)}
                systemParam={systemParam}
                uiAction={uiAction} />
        );
    });
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}