import { useRosterScheduler } from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler() {
    const { error, isLoading, rosterSchedulerData, uiAction } = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        document.title = "EMSTF Computer Operator Roster Scheduler";
        return (
            <RosterSchedulerTable
                rosterSchedulerData={rosterSchedulerData}
                uiAction={uiAction}/>
        ); 
    } else {
        return <Loading />
    }
}