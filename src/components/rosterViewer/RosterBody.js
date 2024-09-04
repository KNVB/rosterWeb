import RosterRow from "./RosterRow";
export default function RosterBody({ calendarDateList, roster, timeOffList, uiAction }) {
    let itoIdList = Object.keys(roster);
    let rowList = [];
    //console.log(roster);    
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <RosterRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                roster={roster[itoId]}
                rowIndex={(index + 5)}
                timeOff={timeOffList[itoId]}
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