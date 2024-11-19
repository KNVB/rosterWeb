import EventHandler from "./EventHandler";
import ITOShiftRow from "./ITOShiftRow";
import PreferredShiftRow from "./PreferredShiftRow";
import VacantShiftRow from "./VacantShiftRow";
export default function RosterSchedulerBody({ dataAction, rosterSchedulerData, rosterSchedulerTableUtil }) {
    let rowList = [];
    let eventHandler = new EventHandler(dataAction, rosterSchedulerTableUtil);
    rosterSchedulerData.itoIdList.forEach(itoId => {
        rowList.push(
            <ITOShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                dataAction={dataAction}
                eventHandler={eventHandler}
                itoId={itoId}
                key={"rosterRow_" + itoId}
                nonStandardWorkingHour={rosterSchedulerData.nonStandardWorkingHourSummary[itoId]}
                previousMonthShiftList={rosterSchedulerData.previousMonthShiftList[itoId]}
                roster={rosterSchedulerData.roster[itoId]}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil}
                rowIndex={rosterSchedulerTableUtil.getRowIndex("rosterRow_" + itoId)}
                systemParam={rosterSchedulerData.systemParam}
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
                rowIndex={rosterSchedulerTableUtil.getRowIndex("preferredShiftRow_" + itoId)}
                systemParam={rosterSchedulerData.systemParam}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil}              
            />
        )
    });
    return (
        <tbody>
            {rowList}
            <VacantShiftRow
                calendarDateList={rosterSchedulerData.calendarDateList}
                systemParam={rosterSchedulerData.systemParam}
                rosterSchedulerTableUtil={rosterSchedulerTableUtil}
                vacantShiftList={rosterSchedulerData.vacantShiftList}
            />
        </tbody>
    )
}