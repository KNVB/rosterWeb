import HeaderRows from "../../common/rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../common/ShiftInfoLegend";
import "./RosterSchedulerTable.css";
export default function RosterSchedulerTable({
    activeShiftList,
    calendarDateList,
    essentialShift,
    itoBlackListShiftPattern,
    preferredShiftList,
    previousMonthShiftList,    
    roster,
    systemParam,
    uiAction
}) {
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
                uiAction={uiAction} />
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={activeShiftList} />
                    </td>
                    <td colSpan="20" className="align-top pt-1">
                    </td>
                    <td colSpan="12" className="align-top p-1">

                    </td>
                </tr>
            </tfoot>
        </table>
    )
}