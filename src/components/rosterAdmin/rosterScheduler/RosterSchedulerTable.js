import { useEffect } from "react";
import HeaderRows from "../../common/rows/HeaderRows";
import RosterBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../common/ShiftInfoLegend";
export default function RosterSchedulerTable({ roster, rosterMonth, rosterSchedulerData, systemParam, uiAction }) {
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
                caption="EMSTF Computer Operator Roster"
                systemParam={systemParam}
                uiAction={uiAction} />
            <RosterBody
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
                    <td colSpan={37}>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}