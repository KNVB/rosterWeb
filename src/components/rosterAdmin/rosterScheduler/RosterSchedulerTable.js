import { useEffect } from "react";
import useRosterSchedulerTable from "./useRosterSchedulerTable";
import HeaderRows from "../../common/rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../common/ShiftInfoLegend";
export default function RosterSchedulerTable({ rosterSchedulerData, dataAction }) {
    const { uiAction } = useRosterSchedulerTable(rosterSchedulerData);
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
                caption="EMSTF Computer Operator Roster Scheduler"
                calendarDateList={rosterSchedulerData.calendarDateList}
                dataAction={dataAction}
                rosterMonth={rosterSchedulerData.rosterMonth}
                systemParam={rosterSchedulerData.systemParam}
                uiAction={uiAction} />
            <RosterSchedulerBody
                dataAction={dataAction}
                rosterSchedulerData={rosterSchedulerData}
                uiAction={uiAction} />
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={rosterSchedulerData.activeShiftList} />
                    </td>
                    <td colSpan={37}>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}