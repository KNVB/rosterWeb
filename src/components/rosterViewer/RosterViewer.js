import { useRosterViewer } from "../../hooks/useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import Loading from "../common/Loading";

import RosterTable from "./RosterTable";
import TimeOffModal from "../common/timeOffModal/TimeOffModal";
export default function RosterViewer() {
    const { error, isLoading, isShowTimeOff, rosterViewerData, selectedITOId, uiAction } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        //console.log(roster.rosterRow);
        document.title = "EMSTF Computer Operator Roster";
        return (
            <>
                <RosterTable
                    rosterViewerData={rosterViewerData}
                    uiAction={uiAction} />
                <TimeOffModal
                    hideTimeOff={uiAction.hideTimeOff}
                    isShowTimeOff={isShowTimeOff}
                    rosterViewerData={rosterViewerData}
                    selectedITOId={selectedITOId}
                />
            </>
        );
    } else {
        return <Loading />
    }
}