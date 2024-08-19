import RosterRow from "./RosterRow";
export default function RosterBody({ calendarDateList, roster, systemParam, uiAction }) {
    let itoIdList = Object.keys(roster.rosterRow);
    let rowList = [];
    //console.log(roster);    
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <RosterRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
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