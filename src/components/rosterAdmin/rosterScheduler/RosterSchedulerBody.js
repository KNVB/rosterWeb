import EventHandler from "./EventHandler";
import ITOShiftRow from "./ITOShiftRow";
import PreferredShiftRow from "./PreferredShiftRow";
import VacantShiftRow from "./VacantShiftRow";
export default function RosterSchedulerBody({ rosterSchedulerData, dataAction, uiAction }) {
    let rowList = [];
    let eventHandler=new EventHandler(dataAction, uiAction);
    rosterSchedulerData.itoIdList.forEach(itoId => {
        //console.log(rosterSchedulerData);
        rowList.push(
            <ITOShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                dataAction={dataAction}
                eventHandler={eventHandler}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                previousMonthShiftList={rosterSchedulerData.previousMonthShiftList[itoId]}
                roster={rosterSchedulerData.roster[itoId]}
                rowIndex={uiAction.getRowIndex("rosterRow_" + itoId)}
                systemParam={rosterSchedulerData.systemParam}
                uiAction={uiAction}
            />
        );
        rowList.push(
            <PreferredShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                dataAction={dataAction}
                eventHandler={eventHandler}
                itoId={itoId}
                key={"preferredShiftRow_" + itoId}
                preferredShiftList={rosterSchedulerData.preferredShiftList[itoId]}
                rowIndex={uiAction.getRowIndex("preferredShiftRow_" + itoId)}
                systemParam={rosterSchedulerData.systemParam}
                uiAction={uiAction}                
            />
        )
    })
    return (
        <tbody>
            {rowList}
            <VacantShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                systemParam={rosterSchedulerData.systemParam}
                uiAction={uiAction}
                vacantShiftList={rosterSchedulerData.vacantShiftList}
            />
        </tbody>
    )
}