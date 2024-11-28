import handleAPIError from "../../common/handleAPIError";
import useRosterScheduler from "./useRosterScheduler";
import Loading from "../../common/Loading";
import RosterSchedulerTable from "./RosterSchedulerTable";
export default function RosterScheduler(){
    const { error, isLoading, rosterSchedulerData, dataAction } = useRosterScheduler();    
    let result;
    switch (true){
        case (error):
            result=handleAPIError(error);
            break;
        case (isLoading):
            result=<Loading />;
            break;
        default:
            document.title = "EMSTF Computer Operator Roster Scheduler";
            result=<RosterSchedulerTable dataAction={dataAction} rosterSchedulerData={rosterSchedulerData} />
            break;
    };
    return result;        
}