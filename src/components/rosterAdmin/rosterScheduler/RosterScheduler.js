import "../../RosterTable.css";
import { useRosterScheduler } from "./useRosterScheduler";
import handleAPIError from "../../../util/handleAPIError";
import HeaderRows from "../../rows/HeaderRows";
import RosterSchedulerBody from "./RosterSchedulerBody";
export default function RosterScheduler() {
    const [objectList, updateHighLightCellIndex, updateRosterMonth] = useRosterScheduler();
    let updateMonth = (newRosterMonth) => {
        updateRosterMonth(newRosterMonth);
    }
    if (objectList.error) {
        return handleAPIError(objectList.error);
    } else {
        if (!objectList.isLoading) {
            //console.log(objectList.systemParam);
            return (
                <table className="m-0 rosterTable">
                    <HeaderRows
                        calendarUtility={objectList.calendarUtility}
                        monthlyCalendar={objectList.monthlyCalendar}
                        highLightCellIndex={objectList.highLightCellIndex}
                        systemParam={objectList.systemParam}
                        updateRosterMonth={updateMonth}                        
                    />
                    <RosterSchedulerBody 
                        activeShiftList={objectList.activeShiftList}
                        monthlyCalendar={objectList.monthlyCalendar}
                        rosterList={objectList.rosterList}
                        systemParam={objectList.systemParam}
                        updateHighLightCellIndex={updateHighLightCellIndex}/>
                </table>
            )
        } else {
            return <></>
        }
    }
}