import { useRosterScheduler } from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
import TimeOffModal from "./TimeOffModal";
export default function RosterScheduler() {
    const { error, isLoading, isShowTimeOff, rosterSchedulerData, selectedITOId, selectedTimeOffDate, uiAction } = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        document.title = "EMSTF Computer Operator Roster Scheduler";
        return (
            <>
                <RosterSchedulerTable
                    rosterSchedulerData={rosterSchedulerData}
                    uiAction={uiAction} />
                {
                    isShowTimeOff &&
                    <TimeOffModal
                        date={selectedTimeOffDate}
                        hideTimeOff={uiAction.hideTimeOff}
                        isShowTimeOff={isShowTimeOff}
                        rosterSchedulerData={rosterSchedulerData}
                        selectedITOId={selectedITOId} />
                }
            </>
        );
    } else {
        return <Loading />
    }
}