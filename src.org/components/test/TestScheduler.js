import {useTestScheduler} from "./useTestScheduler";
import handleAPIError from "../util/handleAPIError";
import MonthPicker from "../util/monthPicker/MonthPicker";
export default function TestScheduler(){
    const{ error, isLoading,roster,rosterSchedulerData,systemParam,uiAction}=useTestScheduler();
    if (error) {
        return handleAPIError(error);
    }
    if (!isLoading){
        console.log(rosterSchedulerData);
        return (
            <>
                TestScheduler<br/>
                <MonthPicker minDate={systemParam.monthPickerMinDate} onChange={uiAction.updateRosterMonth}/>
                {Object.keys(roster.rosterRow["ITO1_1999-01-01"].shiftList).length}
            </>
        )
    }else {
        return <div className="modalBackground"><img src="/icon.gif" /></div>
    }
}