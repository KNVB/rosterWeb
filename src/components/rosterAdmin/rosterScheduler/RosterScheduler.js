import {useRosterScheduler} from "../../../hooks/useRosterScheduler";
import handleAPIError from "../../common/handleAPIError";
export default function RosterScheduler(){
    const { error, isLoading, roster, systemParam, uiAction } = useRosterScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        console.log(roster.rosterRow);
        /*
        return (
            <RosterTable
                roster={roster}
                rosterMonth={rosterMonth}
                systemParam={systemParam}
                uiAction={uiAction} />
        )*/
    } else {
        return <div className="modalBackground"><img src="/icon.gif" /></div>
    }
}