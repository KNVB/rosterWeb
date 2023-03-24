import { useRosterScheduler } from "./util/useRosterScheduler";
import handleAPIError from "../../../util/handleAPIError";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler() {
    const [error, isLoading, rosterData,rosterDataAction, uiAction] = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    } else {
        if (!isLoading) {
            return (
                <RosterSchedulerTable
                    rosterDataList={rosterData}
                    rosterDataAction={rosterDataAction}
                    uiAction={uiAction} />
            )
        } else {
            return <></>
        }
    }
}