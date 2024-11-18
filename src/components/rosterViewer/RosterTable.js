import useRosterTable from "./useRosterTable";
import HeaderRows from "../common/rows/HeaderRows";
import ShiftInfoLegend from "../common/ShiftInfoLegend";
export default function RosterTable({ rosterViewerData, dataAction }) {
    const { activeShiftList, calendarDateList, roster, rosterMonth, systemParam } = rosterViewerData;
    const hightLightAction = useRosterTable();
    return (
        <table className="m-1 p-0 rosterTable">
             <HeaderRows
                caption="EMSTF Computer Operator Roster"
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                hightLightAction={hightLightAction}
                rosterMonth={rosterMonth}
                systemParam={systemParam}/>  
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