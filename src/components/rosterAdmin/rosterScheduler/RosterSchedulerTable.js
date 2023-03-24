import {useEffect} from "react";
import HeaderRows from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
export default function RosterSchedulerTable({rosterDataUtil,rosterMonth,systemParam,uiAction,weekdayNames}){
    useEffect(() => {
        const mouseUp = () => uiAction.endSelect();
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mouseup", mouseUp);
        };
    }, [uiAction]);
    return (
        <table className="m-1 rosterTable">
            <HeaderRows
                rosterMonth={rosterMonth}
                weekdayNames={weekdayNames}
                caption="EMSTF Computer Operator Roster Scheduler"
                uiAction={uiAction}
                systemParam={systemParam} />
            
            <RosterSchedulerBody
                calendarDateList={rosterMonth.calendarDateList}
                rosterDataUtil={rosterDataUtil}
                systemParam={systemParam}
                uiAction={uiAction} /> 
            
        </table>
    )
}