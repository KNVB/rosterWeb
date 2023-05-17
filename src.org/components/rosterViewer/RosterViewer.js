import { useRosterViewer } from "./useRosterViewer";
import handleAPIError from "../util/handleAPIError";
import RosterTable from "./RosterTable";
export default function RosterViewer() {
    const { error, isLoading, roster, rosterMonth, systemParam, uiAction } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        return (
            <RosterTable
                roster={roster}
                rosterMonth={rosterMonth}
                systemParam={systemParam}
                uiAction={uiAction} />
        )
    } else {
        return <div className="modalBackground"><img src="/icon.gif" /></div>
    }
}