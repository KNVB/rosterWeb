import EditableRosterRow from "./rows/EditableRosterRow";
import PreferredShiftRow from "./rows/PreferredShiftRow";
import VacantShiftRow from "./rows/VacantShiftRow";
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
                rowIndex={(index * 2 + 5)}
                systemParam={systemParam}
                uiAction={uiAction}  />
        );
        rowList.push(
            <PreferredShiftRow
                calendarDateList={calendarDateList}
                itoId={itoId}
                key={"preferredShiftRow_" + itoId}
                rosterDataUtil={rosterDataUtil}                
                rowIndex={(index*2 + 6)}
                systemParam={systemParam}
                uiAction={uiAction}/>
        );
    }); 
    return (
        <tbody>
            {rowList}
            <VacantShiftRow 
                calendarDateList={calendarDateList}
                rosterDataUtil={rosterDataUtil}
                rosterTableUtil={rosterTableUtil}
                systemParam={systemParam}
                uiAction={uiAction} />
        </tbody>
    );
}