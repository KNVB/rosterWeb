import { useEffect } from "react";
import AutoPlanner from "./autoPlanner/AutoPlanner";
import HeaderRows from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../../util/ShiftInfoLegend";
export default function RosterSchedulerTable({autoPlannerResult, rosterDataUtil, rosterMonth, systemParam, uiAction, weekdayNames }) {
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
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={rosterDataUtil.getActiveShiftList()} />
                    </td>
                    <td colSpan="21" rowSpan="10" className="align-top pt-1">
                        <AutoPlanner
                            autoPlannerResult={autoPlannerResult}
                            calendarDateList={rosterMonth.calendarDateList}
                            rosterDataUtil={rosterDataUtil}
                            rosterMonth={rosterMonth}
                            systemParam={systemParam}
                            uiAction={uiAction} />
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}