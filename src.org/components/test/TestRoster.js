import {useTestRoster} from "./useTestRoster";
import handleAPIError from "../util/handleAPIError";
import MonthPicker from "../util/monthPicker/MonthPicker";
export default function TestRoster(){
    const{ error, isLoading,roster,systemParam,uiAction}=useTestRoster();
    if (error) {
        return handleAPIError(error);
    }
    if (!isLoading){
        return (
            <>
                <MonthPicker minDate={systemParam.monthPickerMinDate} onChange={uiAction.updateRosterMonth}/>
                {(Object.keys(roster.rosterRow["ITO1_1999-01-01"].shiftList).length)}
            </>
        )
    }else {
        return <div className="modalBackground"><img src="/icon.gif" /></div>
    }
}