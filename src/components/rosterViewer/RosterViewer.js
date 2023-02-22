import { useRosterViewer } from "./useRosterViewer";
import handleAPIError from "../../util/handleAPIError";
import "../RosterTable.css";
import HeaderRows from "../rows/HeaderRows";
import RosterViewerBody from "./RosterViewerBody";
import ShiftInfoLegend from "../ShiftInfoLegend";
export default function RosterViewer() {
    const [objectList, updateHighLightCellIndex, updateRosterMonth] = useRosterViewer();
    document.title = "EMSTF Resident Support & Computer Operation Support Services Team Roster";
    let updateMonth = (newRosterMonth) => {
        updateRosterMonth(newRosterMonth);
    }
    if (objectList.error) {
        return handleAPIError(objectList.error);
    } else {
        if (!objectList.isLoading) {
            //console.log(objectList.activeShiftList);
            return (
                <table className="m-3 rosterTable">
                    <HeaderRows
                        calendarUtility={objectList.calendarUtility}
                        monthlyCalendar={objectList.monthlyCalendar}
                        highLightCellIndex={objectList.highLightCellIndex}
                        systemParam={objectList.systemParam}
                        updateRosterMonth={updateMonth}
                    />
                    <RosterViewerBody 
                        activeShiftList={objectList.activeShiftList}
                        monthlyCalendar={objectList.monthlyCalendar}
                        rosterList={objectList.rosterList}
                        updateHighLightCellIndex={updateHighLightCellIndex}
                    />
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