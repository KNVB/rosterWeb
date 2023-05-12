import HeaderRows from "../rows/HeaderRows";
import RosterBody from "./RosterBody";
import ShiftInfoLegend from "../util/ShiftInfoLegend";
export default function RosterTable({roster,rosterMonth,systemParam,uiAction}){
    return(
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
                systemParam={systemParam}
                uiAction={uiAction}/>    
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