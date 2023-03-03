import { useRosterScheduler } from "./useRosterScheduler";
import handleAPIError from "../../../util/handleAPIError";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler(){
    const [objectList, updatePreferredShift,updateRosterMonth,updateShift] = useRosterScheduler();    
    if (objectList.error) {
        return handleAPIError(objectList.error);
    } else {
        if (!objectList.isLoading) {
            //console.log(objectList.systemParam);
            //console.log(objectList.rosterList);
            //console.log(objectList);
            return (
                <RosterSchedulerTable
                    objectList={objectList}
                    updatePreferredShift={updatePreferredShift}
                    updateRosterMonth={updateRosterMonth}
                    updateShift={updateShift}/>
            )
        } else {
            return <></>
        }

    }
}