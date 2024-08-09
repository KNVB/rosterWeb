import { useRosterViewer } from "../../hooks/useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import RosterTable from "./RosterTable";
import Loading from "../common/Loading";
export default function RosterViewer(){
    const { activeShiftList, calendarDateList, error, isLoading, roster, systemParam, uiAction } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading){
        return <Loading />
    }
    document.title = "EMSTF Computer Operator Roster";
    
    return (
        <RosterTable
            activeShiftList={activeShiftList}
            calendarDateList={calendarDateList}
            roster={roster}
            systemParam={systemParam}
            uiAction={uiAction} />
    );
}