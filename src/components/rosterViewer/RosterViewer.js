import { useRosterViewer } from "../../hooks/useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import Loading from "../common/Loading";

import RosterTable from "./RosterTable";
import TimeOffModal from "./TimeOffModal";
export default function RosterViewer() {
    const { error, isLoading, isShowTimeOff, rosterViewerData,selectedITOInfo, selectedTimeOff, uiAction } = useRosterViewer();
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
                <TimeOffModal
                    hideTimeOff={uiAction.hideTimeOff}
                    isShowTimeOff={isShowTimeOff}
                    selectedITOInfo={selectedITOInfo}
                    selectedTimeOff={selectedTimeOff}/>
            </>
        );
    } else {
        return <Loading />
    }
}