import HeaderRows from "../common/rows/HeaderRows";
import RosterBody from "./RosterBody";
import ShiftInfoLegend from "../common/ShiftInfoLegend";
export default function RosterTable({ activeShiftList, calendarDateList, roster, systemParam, uiAction }) {
    return (
        <table className="m-1 p-0 rosterTable">
            <HeaderRows
                caption="EMSTF Computer Operator Roster"
                calendarDateList={calendarDateList}
                systemParam={systemParam}
                uiAction={uiAction} />
            <RosterBody
                roster={roster}
                calendarDateList={calendarDateList}
                systemParam={systemParam}
                uiAction={uiAction} />
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