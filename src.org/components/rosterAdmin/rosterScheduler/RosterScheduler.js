import { useRosterScheduler } from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
import ShiftDetailModal from "./shiftDetailModal/ShiftDetailModal";
export default function RosterScheduler() {
    const { error, isLoading, isShowShiftDetail, rosterSchedulerData, shiftDetail, uiAction } = useRosterScheduler();
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
                    <ShiftDetailModal                 
                        isShowShiftDetail={isShowShiftDetail}                       
                        selectedShiftDetail={shiftDetail} 
                        uiAction={uiAction}/>
                }
            </>
        );
    } else {
        return <Loading />
    }
}