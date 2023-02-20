import { useRosterViewer } from "./useRosterViewer";
import handleAPIError from "../../util/handleAPIError";
export default function RosterViewer() {
    const [objectList, updateHighLightCellIndex, updateRosterMonth] = useRosterViewer();
    if (objectList.error){
        return handleAPIError(objectList.error);
    }
    return <></>
}