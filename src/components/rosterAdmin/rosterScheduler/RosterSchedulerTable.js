import "../../RosterTable.css";
import HeaderRows from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../ShiftInfoLegend";
import { useEffect } from 'react';
import { useRosterSchedulerTable } from "./useRosterSchedulerTable";
export default function RosterSchedulerTable({ objectList, updatePreferredShift, updateRosterMonth, updateShift }) {
    const [itemList, endSelect,getSelectedClassName, startSelect, updateUI] = useRosterSchedulerTable();
    useEffect(() => {
        let mouseUpHandler = document.addEventListener("mouseup", () => {
            endSelect();
        });
        return () =>{
            document.removeEventListener("mouseup", mouseUpHandler);
        } 
    }, [])
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
                getSelectedClassName={getSelectedClassName}
                highLightRowIndex={itemList.highLightRowIndex}                
                monthlyCalendar={objectList.monthlyCalendar}
                rosterList={objectList.rosterList}
                startSelect={startSelect}
                systemParam={objectList.systemParam}
                updateUI={updateUI}
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
