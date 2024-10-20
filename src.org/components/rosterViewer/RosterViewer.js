import { useRosterViewer } from "../../hooks/useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import Loading from "../common/Loading";

import RosterTable from "./RosterTable";
import ShiftDetailModal from "./ShiftDetailModal";
export default function RosterViewer() {
    const { error, isLoading, isShowShiftDetail, rosterViewerData, selectedShiftDetail, uiAction } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        //console.log( rosterViewerData);
        document.title = "EMSTF Computer Operator Roster";
        return (
            <>
                <RosterTable
                    rosterViewerData={rosterViewerData}
                    uiAction={uiAction} />
                <ShiftDetailModal
                    hideShiftDetail={uiAction.hideShiftDetail}
                    isShowShiftDetail={isShowShiftDetail}
                    selectedShiftDetail={selectedShiftDetail} />
            </>
        );
    } else {
        return <Loading />
    }
}