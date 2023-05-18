import { useEffect } from "react";
import AutoPlanner from "./autoPlanner/AutoPlanner";
import HeaderRows from "../../common/rows/HeaderRows";
import RosterBody from "./RosterSchedulerBody";
import ShiftInfoLegend from "../../common/ShiftInfoLegend";
import YearlyRosterStatisticTable from "./YearlyRosterStaticTable";
import "./RosterSchedulerTable.css";
export default function RosterSchedulerTable({autoPlanResult, roster, rosterMonth, rosterSchedulerData, systemParam, uiAction }) {
    useEffect(() => {
        const mouseUp = () => uiAction.endSelect();
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mouseup", mouseUp);
        };
    }, [uiAction]);
    return (
        <table className="m-1 p-0 rosterTable">
            <HeaderRows
                rosterMonth={rosterMonth}
                weekdayNames={roster.weekdayNames}
                caption="EMSTF Computer Operator Roster Scheduler"
                systemParam={systemParam}
                uiAction={uiAction} />
            <RosterBody
                roster={roster}
                rosterMonth={rosterMonth}
                rosterSchedulerData={rosterSchedulerData}
                systemParam={systemParam}
                uiAction={uiAction} />
            <tfoot>
                <tr>
                    <td colSpan="7" className="pt-1">
                        <ShiftInfoLegend activeShiftList={roster.activeShiftList} />
                    </td>
                    <td colSpan="20" className="align-top pt-1">
                        <AutoPlanner
                            autoPlanResult={autoPlanResult}
                            rosterMonth={rosterMonth}
                            uiAction={uiAction} />                        
                        <div className="d-flex flex-row ms-1">
                            <div className="d-flex flex-column flex-grow-1 mb-1">
                                <div className="d-flex flex-grow-1 justify-content-center">
                                    <div className="clearAllButton" onClick={uiAction.clearAllShiftData}>Clear All Shift Data</div>
                                </div>
                                <div className="d-flex flex-grow-1 justify-content-center mt-1">
                                    <div className="exportButton" onClick={uiAction.exportRosterDataToExcel}>Export To Excel File</div>                                    
                                </div>
                            </div>
                            <div className="d-flex flex-column flex-grow-1">
                                <div className="d-flex flex-grow-1 justify-content-center">
                                    <div className="fillEmptyShiftWithOButton" onClick={uiAction.fillEmptyShiftWithO}>Fill empty shift with "O"</div>
                                </div>
                                <div className="d-flex flex-grow-1 justify-content-center mt-1">
                                    <div className="saveRosterToDBButton" onClick={uiAction.saveRosterToDB}>Save All Data To DB</div>
                                </div>   
                            </div>
                        </div>
                    </td>
                    <td colSpan="12" className="align-top p-1">
                        <YearlyRosterStatisticTable 
                            yearlyRosterStatistic={rosterSchedulerData.yearlyRosterStatistic}/>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}