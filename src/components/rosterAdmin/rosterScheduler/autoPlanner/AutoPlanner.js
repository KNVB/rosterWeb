import "./AutoPlanner.css";
import useAutoPlanner from "./useAutoPlanner";

export default function AutoPlanner({ rosterSchedulerData, dataAction }) {
    const { startDate, endDate, iterationCount, action } = useAutoPlanner(rosterSchedulerData, dataAction);
    return (
        <table className="mt-1">
            <thead>
                <tr>
                    <td>Auto Planning Start From:</td>
                    <td colSpan={2}>
                        <select onChange={action.updateStartDate} value={startDate}>
                            {
                                rosterSchedulerData.calendarDateList.map(calendarDate => (
                                    <option key={"startDate_" + calendarDate.dateOfMonth} value={calendarDate.dateOfMonth}>{calendarDate.dateOfMonth}</option>
                                ))
                            }
                        </select>
                        &nbsp;to&nbsp;
                        <select onChange={action.updateEndDate} value={endDate}>
                            {
                                rosterSchedulerData.calendarDateList.map(calendarDate => (
                                    <option key={"endDate_" + calendarDate.dateOfMonth} value={calendarDate.dateOfMonth}>{calendarDate.dateOfMonth}</option>
                                ))
                            }
                        </select>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Iteration Count:</td>
                    <td><input min="1" onChange={action.updateIterationCount} type="number" value={iterationCount}/></td>
                    <td>&nbsp;<div className="autoPlannerButton" >Auto Planner</div></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={3} className="text-center">
                    </td>
                </tr>
            </tfoot>
        </table>
    )
} 