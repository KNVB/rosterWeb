import { useRosterViewer } from "./useRosterViewer";
import handleAPIError from "../../util/handleAPIError";
import "../RosterTable.css";
import HeaderRows from "../rows/HeaderRows";
import RosterViewerBody from "./RosterViewerBody";
export default function RosterViewer() {
    const [objectList, updateHighLightCellIndex, updateRosterMonth] = useRosterViewer();
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
                            <td className={objectList.activeShiftList.a.cssClassName} colSpan="11">
                                {objectList.activeShiftList.a.type} : {objectList.activeShiftList.a.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.b.cssClassName} colSpan="11">
                                {objectList.activeShiftList.b.type} : {objectList.activeShiftList.b.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.b1.cssClassName} colSpan="11">
                                {objectList.activeShiftList.b1.type} : {objectList.activeShiftList.b1.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.c.cssClassName} colSpan="11">
                                {objectList.activeShiftList.c.type} : {objectList.activeShiftList.c.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.d.cssClassName} colSpan="11">
                                {objectList.activeShiftList.d.type} : {objectList.activeShiftList.d.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.d1.cssClassName} colSpan="11">
                                {objectList.activeShiftList.d1.type} : {objectList.activeShiftList.d1.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.d2.cssClassName} colSpan="11">
                                {objectList.activeShiftList.d2.type} : {objectList.activeShiftList.d2.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.d3.cssClassName} colSpan="11">
                                {objectList.activeShiftList.d3.type} : {objectList.activeShiftList.d3.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.s.cssClassName} colSpan="11">
                                {objectList.activeShiftList.s.type} : {objectList.activeShiftList.s.timeSlot}
                            </td>
                        </tr>
                        <tr>
                            <td className={objectList.activeShiftList.O.cssClassName} colSpan="11">
                                {objectList.activeShiftList.O.type} : {objectList.activeShiftList.O.timeSlot}
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