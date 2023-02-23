import "../../RosterTable.css";
import { useRosterScheduler } from "./useRosterScheduler";
import handleAPIError from "../../../util/handleAPIError";
import HeaderRows from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../ShiftInfoLegend";
export default function RosterScheduler() {
    const [objectList, updateHighLightCellIndex, updatePreferredShift,updateRosterMonth,updateShift] = useRosterScheduler();
    let updateMonth = (newRosterMonth) => {
        updateRosterMonth(newRosterMonth);
    }
    if (objectList.error) {
        return handleAPIError(objectList.error);
    } else {
        if (!objectList.isLoading) {
            //console.log(objectList.systemParam);
            //console.log(objectList.rosterList);
            return (
                <table className="m-0 rosterTable">
                    <HeaderRows
                        calendarUtility={objectList.calendarUtility}
                        monthlyCalendar={objectList.monthlyCalendar}
                        highLightCellIndex={objectList.highLightCellIndex}
                        systemParam={objectList.systemParam}
                        updateRosterMonth={updateMonth}/>
                   
                    <RosterSchedulerBody
                        allITOStat={objectList.allITOStat}
                        activeShiftList={objectList.activeShiftList}
                        monthlyCalendar={objectList.monthlyCalendar}
                        rosterList={objectList.rosterList}
                        systemParam={objectList.systemParam}
                        updateHighLightCellIndex={updateHighLightCellIndex}
                        updatePreferredShift={updatePreferredShift}
                        updateShift={updateShift}/>
                    <tfoot>
                        <tr>
                            <td colSpan="42">&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="11" className="p-0">
                                <ShiftInfoLegend activeShiftList={objectList.activeShiftList}/>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            )
        } else {
            return <></>
        }
    }
}