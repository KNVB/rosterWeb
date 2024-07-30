import { useRosterViewer } from "../../hooks/useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import RosterTable from "./RosterTable";
import Loading from "../common/Loading";
export default function RosterViewer() {
    const { error, isLoading, roster, rosterMonth, systemParam, uiAction } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        //console.log(roster.rosterRow);
        document.title="EMSTF Computer Operator Roster";
        return (
            <RosterTable
                roster={roster}
                rosterMonth={rosterMonth}
                systemParam={systemParam}
                uiAction={uiAction} />
        );
    } else {
        return <Loading/>
    }
}