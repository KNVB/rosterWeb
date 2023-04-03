import { useEffect } from "react";
import AutoPlanner from "./autoPlanner/AutoPlanner";
import HeaderRows from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../../util/ShiftInfoLegend";
export default function RosterSchedulerTable({ autoPlanResult, roster, rosterMonth, rosterSchedulerData, systemParam, uiAction }) {
    useEffect(() => {
        const mouseUp = () => uiAction.endSelect();
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mouseup", mouseUp);
        };
    }, [uiAction]);    
    return (
        <table className="m-1 p-0 rosterTable">
            <HeaderRows
                rosterMonth={rosterMonth}
                weekdayNames={roster.weekdayNames}
                caption="EMSTF Computer Operator Roster Scheduler"
                systemParam={systemParam}
                uiAction={uiAction} />
            <RosterSchedulerBody
                roster={roster}
                rosterMonth={rosterMonth}
                rosterSchedulerData={rosterSchedulerData}
                systemParam={systemParam}
                uiAction={uiAction} />
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={roster.activeShiftList} />
                    </td>
                    <td colSpan="20" className="align-top pt-0">
                        <AutoPlanner
                            autoPlanResult={autoPlanResult}
                            rosterMonth={rosterMonth}
                            uiAction={uiAction} />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}