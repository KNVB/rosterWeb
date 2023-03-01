import { useRosterViewer } from "./useRosterViewer";
import handleAPIError from "../../util/handleAPIError";
import "../RosterTable.css";
import HeaderRows from "../rows/HeaderRows";
import RosterViewerBody from "./RosterViewerBody";
import ShiftInfoLegend from "../ShiftInfoLegend";
export default function RosterViewer() {
    const [objectList, updateHighLight, updateRosterMonth] = useRosterViewer();
    document.title = "EMSTF Resident Support & Computer Operation Support Services Team Roster";
    let updateMonth = (newRosterMonth) => {
        updateRosterMonth(newRosterMonth);
    }
    if (objectList.error) {
        return handleAPIError(objectList.error);
    } else {
        if (!objectList.isLoading) {
            //console.log(objectList.activeShiftList);
            //console.log(objectList);
            return (
                <table className="m-3 rosterTable">
                    <HeaderRows
                        calendarUtility={objectList.calendarUtility}
                        caption="EMSTF Resident Support & Computer Operation Support Services Team Roster"
                        monthlyCalendar={objectList.monthlyCalendar}
                        highLightCellIndex={objectList.highLightCellIndex}
                        systemParam={objectList.systemParam}
                        updateRosterMonth={updateMonth}
                    />
                    <RosterViewerBody 
                        activeShiftList={objectList.activeShiftList}
                        highLightRowIndex={objectList.highLightRowIndex}
                        monthlyCalendar={objectList.monthlyCalendar}
                        rosterList={objectList.rosterList}
                        updateHighLight={updateHighLight}
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