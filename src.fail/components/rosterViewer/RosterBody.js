import RosterRow from "./RosterRow";
export default function RosterBody({ calendarDateList, dataAction, roster, uiAction }) {
    let itoIdList = Object.keys(roster);
    let rowList = [];
    //console.log(roster);    
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <RosterRow
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                roster={roster[itoId]}
                rowIndex={(index + 5)}
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