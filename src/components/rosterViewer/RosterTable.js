import useRosterTable from "./useRosterTable";
import HeaderRows from "../common/rows/HeaderRows";
import RosterBody from "./RosterBody";
import ShiftInfoLegend from "../common/ShiftInfoLegend";
export default function RosterTable({ rosterViewerData, dataAction }) {
    const { activeShiftList, calendarDateList, nonStandardWorkingHourSummary, roster, rosterMonth, systemParam } = rosterViewerData;
    const highLightAction = useRosterTable();
    return (
        <table className="m-1 p-0 rosterTable">
             <HeaderRows
                caption="EMSTF Computer Operator Roster"
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                highLightAction={highLightAction}
                rosterMonth={rosterMonth}
                systemParam={systemParam}/>
              <RosterBody
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                highLightAction={highLightAction}
                nonStandardWorkingHourSummary={nonStandardWorkingHourSummary}
                roster={roster}/>  
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