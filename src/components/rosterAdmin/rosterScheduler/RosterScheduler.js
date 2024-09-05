import { useRosterScheduler } from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
import TimeOffModal from "../../common/timeOffModal/TimeOffModal";
export default function RosterScheduler() {
    const { error, isLoading, isShowTimeOff, rosterSchedulerData, selectedITOId, uiAction } = useRosterScheduler();
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
                <TimeOffModal
                    hideTimeOff={uiAction.hideTimeOff}
                    isShowTimeOff={isShowTimeOff}
                    rosterViewerData={rosterSchedulerData}
                    selectedITOId={selectedITOId}
                />
            </>
        );
    } else {
        return <Loading />
    }
}