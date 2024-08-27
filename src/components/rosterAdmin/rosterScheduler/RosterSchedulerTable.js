import { useEffect } from "react";
import HeaderRows from "../../common/rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../common/ShiftInfoLegend";
export default function RosterSchedulerTable({ rosterSchedulerData, uiAction }) {
    const { activeShiftList, calendarDateList, preferredShiftList, previousMonthShiftList, roster, systemParam, timeOffList } = rosterSchedulerData;
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
                calendarDateList={calendarDateList}
                systemParam={systemParam}
                uiAction={uiAction} />
            <RosterSchedulerBody
                calendarDateList={calendarDateList}
                preferredShiftList={preferredShiftList}
                previousMonthShiftList={previousMonthShiftList}
                roster={roster}
                systemParam={systemParam}
                timeOffList={timeOffList}
                uiAction={uiAction}
            />
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={activeShiftList} />
                    </td>
                    <td colSpan={37}>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}