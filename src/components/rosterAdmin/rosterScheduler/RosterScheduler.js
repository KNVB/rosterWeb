import { useRosterScheduler } from "./util/useRosterScheduler";
import handleAPIError from "../../../util/handleAPIError";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler() {
    const { autoPlannerUtil, error, isLoading, rosterMonth, rosterDataUtil, systemParam, uiAction, weekdayNames } = useRosterScheduler();
    if (error) {
        console.log(error);
        return handleAPIError(error);
    } else {
        if (!isLoading) {
            return (
                <RosterSchedulerTable
                    autoPlannerUtil={autoPlannerUtil}
                    rosterDataUtil={rosterDataUtil}
                    rosterMonth={rosterMonth}
                    systemParam={systemParam}
                    uiAction={uiAction}
                    weekdayNames={weekdayNames} />
            )

        } else {
            return <></>
        }
    }
}