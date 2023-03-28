import "./AutoPlanner.css";
export default function AutoPlanner({autoPlannerUtil, rosterMonth, uiAction}){
    let updateEndDate=e=>{
        uiAction.updateAutoPlanEndDate(e.target.value)
    }
    let updateIterationCount=e=>{
        uiAction.updateAutoPlanIterationCount(e.target.value);
    }
    let updateStartDate=e=>{
        uiAction.updateAutoPlanStartDate(e.target.value);
    }
    return(
        <table className="mt-0">
            <thead>
                <tr>
                    <td>Auto Planning Start From:</td>
                    <td colSpan={2}>
                        <select onChange={updateStartDate} value={autoPlannerUtil.getStartDate()}>
                            {
                                rosterMonth.calendarDateList.map(calendarDate=>(
                                    <option key={"startDate_"+calendarDate.dateOfMonth} value={calendarDate.dateOfMonth}>{calendarDate.dateOfMonth}</option>
                                ))
                            }
                        </select>
                        &nbsp;to&nbsp;
                        <select onChange={updateEndDate} value={autoPlannerUtil.getEndDate()}>
                            {
                                rosterMonth.calendarDateList.map(calendarDate=>(
                                    <option key={"endDate_"+calendarDate.dateOfMonth} value={calendarDate.dateOfMonth}>{calendarDate.dateOfMonth}</option>
                                ))
                            }
                        </select>
                    </td>                    
                </tr>                
            </thead>
            <tbody>
                <tr>
                    <td>Iteration Count:</td>
                    <td><input onChange={updateIterationCount} type="number" value={autoPlannerUtil.getIterationCount()}/></td>
                    <td>&nbsp;<a className="autoPlannerButton" onClick={uiAction.startAutoPlan}>Auto Planner</a></td>
                </tr>                
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={3} className="text-center">
                        <a className="fillEmptyShiftWithOButton" onClick={uiAction.fillEmptyShiftWithO}>Fill empty shift with "O"</a>
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}