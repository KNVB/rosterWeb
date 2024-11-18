import handleAPIError from "../common/handleAPIError";
import useRosterViewer from "./useRosterViewer";
import Loading from "../common/Loading";
import RosterTable from "./RosterTable";
export default function RosterViewer(){
    const { error, isLoading, rosterViewerData, dataAction } = useRosterViewer();
    let result;
    switch (true){
        case (error):
            result=handleAPIError(error);
            break;
        case (isLoading):
            result=<Loading />;
            break;
        default:
            document.title = "EMSTF Computer Operator Roster";
            result=<RosterTable dataAction={dataAction} rosterViewerData={rosterViewerData} />
            break    
    }
    return result;
}