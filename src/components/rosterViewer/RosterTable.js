import useRosterTable from "./useRosterTable";
import HeaderRows from "../common/rows/HeaderRows";
import RosterBody from "./RosterBody"
import ShiftInfoLegend from "../common/ShiftInfoLegend";
export default function RosterTable({ rosterViewerData, dataAction }) {
    const { activeShiftList, calendarDateList, roster, systemParam, shiftDetailList } = rosterViewerData;
    const { uiAction } = useRosterTable();
    return (
        <table className="m-1 p-0 rosterTable">
            <HeaderRows
                caption="EMSTF Computer Operator Roster"
                calendarDateList={calendarDateList}
                systemParam={systemParam}
                dataAction={dataAction}
                uiAction={uiAction} />
            <RosterBody
                calendarDateList={calendarDateList}
                dataAction={dataAction}
                roster={roster}               
                shiftDetailList={shiftDetailList}
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