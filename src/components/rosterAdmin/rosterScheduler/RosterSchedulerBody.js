import EditableRosterRow from "./rows/EditableRosterRow";
export default function RosterSchedulerBody({ calendarDateList, rosterDataUtil, rosterTableUtil, systemParam,uiAction }) {
    let rowList = [];
    let itoIdList = rosterDataUtil.getItoIdList();
    itoIdList.forEach((itoId, index) => {
        rowList.push(
            <EditableRosterRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                rosterDataUtil={rosterDataUtil}
                rosterTableUtil={rosterTableUtil}
                rowIndex={(index * 1 + 5)}
                systemParam={systemParam}
                uiAction={uiAction}  />
        );
    /*    
        rowList.push(
            <PreferredShiftRow
                itoId={itoId}
                key={"preferredShiftRow_" + itoId}
                rosterData={rosterData}
                rosterDataAction={rosterDataAction}
                rowIndex={(index*2 + 6)}
                uiAction={uiAction}
                uiData={uiData} />
        );
    */   
    }); 
    return (
        <tbody>
            {rowList}
        </tbody>
    );
}