import useRosterScheduler from "./useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
import ShiftDetailModal from "./shiftDetailModal/ShiftDetailModal";
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
                    activeShiftList={rosterSchedulerData.activeShiftList}
                    hideShiftDetail={dataAction.hideShiftDetail}
                    isShowShiftDetail={isShowShiftDetail}
                    incomingShiftObj={selectedShift}
                    updateShiftFromModal={dataAction.updateShiftFromModal}
                />
            </>
        )
    } else {
        return <Loading />
    }
}