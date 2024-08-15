import HeaderRows from "../../common/rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../common/ShiftInfoLegend";
export default function RosterSchedulerTable({ rosterSchedulerData, uiAction }){
    const { activeShiftList, calendarDateList,preferredShiftList,previousMonthShiftList, roster, systemParam } = rosterSchedulerData;
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