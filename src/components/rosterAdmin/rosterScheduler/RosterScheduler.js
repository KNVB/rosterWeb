import { useRosterScheduler } from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";

export default function RosterScheduler() {
    const { activeShiftList, calendarDateList, error, isLoading, roster, systemParam, uiAction} = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        document.title = "EMSTF Computer Operator Roster Scheduler";
        return (
            <div></div>
        )
    } else {
        return <Loading />
    }
}