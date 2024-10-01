import useRosterViewer from "./useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import Loading from "../common/Loading";
export default function RosterViewer(){
    const { error, isLoading, isShowShiftDetail, rosterViewerData, selectedShift, action } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        document.title = "EMSTF Computer Operator Roster";
        console.log(rosterViewerData);
    }else {
        return <Loading />
    }
} 