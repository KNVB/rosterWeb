import "../../RosterTable.css";
import HeaderRows from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../ShiftInfoLegend";
import { useRosterSchedulerTable } from "./useRosterSchedulerTable";
export default function RosterSchedulerTable({ objectList, updatePreferredShift, updateRosterMonth, updateShift }) {
    const [itemList, updateHighLight] = useRosterSchedulerTable();
    return (
        <table className="m-0 rosterTable">
            <HeaderRows
                calendarUtility={objectList.calendarUtility}
                caption="EMSTF Roster Scheduler"
                monthlyCalendar={objectList.monthlyCalendar}
                highLightCellIndex={itemList.highLightCellIndex}
                systemParam={objectList.systemParam}
                updateRosterMonth={updateRosterMonth} />
            <RosterSchedulerBody
                allITOStat={objectList.allITOStat}
                activeShiftList={objectList.activeShiftList}
                highLightRowIndex={itemList.highLightRowIndex}
                monthlyCalendar={objectList.monthlyCalendar}
                rosterList={objectList.rosterList}
                systemParam={objectList.systemParam}
                updateHighLight={updateHighLight}
                updatePreferredShift={updatePreferredShift}
                updateShift={updateShift} />
            <tfoot>
                <tr>
                    <td colSpan="42">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="11" className="p-0">
                        <ShiftInfoLegend activeShiftList={objectList.activeShiftList} />
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}
