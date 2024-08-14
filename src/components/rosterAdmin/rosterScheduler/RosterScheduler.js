import { useRosterScheduler } from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler() {
    const rosterSchedulerData = useRosterScheduler();
    if (rosterSchedulerData.error) {
        return handleAPIError(rosterSchedulerData.error);
    }
    if (rosterSchedulerData.isLoading === false) {
        document.title = "EMSTF Computer Operator Roster Scheduler";
        console.log(rosterSchedulerData);
        return (
            <RosterSchedulerTable
                activeShiftList={rosterSchedulerData.activeShiftList}
                calendarDateList={rosterSchedulerData.calendarDateList}
                essentialShift={rosterSchedulerData.essentialShift}
                itoBlackListShiftPattern={rosterSchedulerData.itoBlackListShiftPattern}
                preferredShiftList={rosterSchedulerData.preferredShiftList}
                previousMonthShiftList={rosterSchedulerData.previousMonthShiftList}
                roster={rosterSchedulerData.roster}
                systemParam={rosterSchedulerData.systemParam}
                uiAction={rosterSchedulerData.uiAction}
            />
        )
    } else {
        return <Loading />
    }
}