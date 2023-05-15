import { useTest } from "./useTest";
import handleAPIError from "../util/handleAPIError";
export default function Test() {
    const {error,isLoading,roster,uiAction}=useTest();
    if (error) {
        return handleAPIError(error);
    }
    if (isLoading === false) {
        //console.log(itemList.dataUtil.getRoster().rosterRow);
        return (
            <>
                {Object.keys(roster.rosterRow["ITO1_1999-01-01"].shiftList).length}
                <button onClick={uiAction.go}>Go</button>
            </>
        )
    } else {
        return <div className="modalBackground"><img src="/icon.gif" /></div>
    }
}