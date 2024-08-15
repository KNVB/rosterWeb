import { useRosterViewer } from "../../hooks/useRosterViewer";
import handleAPIError from "../common/handleAPIError";
import Loading from "../common/Loading";
import RosterTable from "./RosterTable";
export default function RosterViewer() {
    const { error, isLoading, rosterViewerData, uiAction } = useRosterViewer();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        //console.log(roster.rosterRow);
        document.title = "EMSTF Computer Operator Roster";
        return (
            <RosterTable
                rosterViewerData={rosterViewerData}
                uiAction={uiAction} />
        );
    } else {
        return <Loading />
    }
}