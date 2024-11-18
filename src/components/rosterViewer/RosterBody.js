import RosterRow from "./RosterRow";
export default function RosterBody({ calendarDateList, dataAction, roster, highLightAction }) {
    let itoIdList = Object.keys(roster);
    let rowList = [];
    //console.log(roster);    
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <RosterRow
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                highLightAction={highLightAction}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                roster={roster[itoId]}
                rowIndex={(index + 5)}
                />
        );
    });
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}