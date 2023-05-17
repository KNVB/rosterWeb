import {useRosterScheduler} from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler(){
    const {autoPlanResult, error, isLoading, roster,rosterMonth, rosterSchedulerData, systemParam, uiAction } = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        document.title="EMSTF Computer Operator Roster Scheduler";
        //console.log(rosterSchedulerData);        
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