import useRosterViewer from "./useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import Loading from "../common/Loading";
import RosterTable from "./RosterTable";
import ShiftDetailModal from "./ShiftDetailModal";
export default function RosterViewer() {
    const { error, isLoading, isShowShiftDetail, rosterViewerData, selectedShift, dataAction } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        document.title = "EMSTF Computer Operator Roster";
        return (
            <>
                <RosterTable
                    dataAction={dataAction}
                    rosterViewerData={rosterViewerData} />
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