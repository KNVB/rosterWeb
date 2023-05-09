import { useRosterScheduler } from "./util/useRosterScheduler";
import handleAPIError from "../../util/handleAPIError";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler() {
    const { autoPlanResult, error, isLoading, roster, rosterMonth, rosterSchedulerData, systemParam, uiAction } = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (!isLoading) {
        return (
            <RosterSchedulerTable
                autoPlanResult={autoPlanResult}
                roster={roster}
                rosterMonth={rosterMonth}
                rosterSchedulerData={rosterSchedulerData}
                systemParam={systemParam}
                uiAction={uiAction} />
        )
    } else {
        return <div className="modalBackground"><img src="/icon.gif" /></div>
    }

}