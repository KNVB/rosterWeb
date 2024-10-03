import useRosterScheduler from "./useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
import ShiftDetailModal from "./ShiftDetailModal";
export default function RosterScheduler() {
    const { error, isLoading, isShowShiftDetail, rosterSchedulerData, selectedShift, dataAction } = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        document.title = "EMSTF Computer Operator Roster Scheduler";
        return (
            <>
                <RosterSchedulerTable
                    dataAction={dataAction}
                    rosterSchedulerData={rosterSchedulerData} />
                <ShiftDetailModal
                    hideShiftDetail={dataAction.hideShiftDetail}
                    isShowShiftDetail={isShowShiftDetail}
                    selectedShift={selectedShift}
                />
            </>
        )
    } else {
        return <Loading />
    }
}