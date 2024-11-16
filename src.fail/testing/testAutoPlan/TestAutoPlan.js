import AutoPlan from "./AutoPlanner";
import NameCell from "../../components/common/cells/NameCell";
import ShiftCell from "../../components/common/cells/ShiftCell";
import rosterSchedulerData from "./oct_data";
//import rosterSchedulerData from "./sep_data";
export default function TestAutoPlan() {
    //===================================================================================
    rosterSchedulerData.itoIdList.forEach(itoId =>{
        rosterSchedulerData.roster[itoId].shiftList={};
    });
    
    //let endDate=rosterSchedulerData.calendarDateList.length,startDate=1;
    let startDate=1,endDate=31;
    let autoPlanner = new AutoPlan(startDate,endDate,rosterSchedulerData);
    let bodyRows = [];
    let headerCells = [<td className="borderCell dayCell text-center" key='day_0'></td>];
    let planResult = autoPlanner.start();    
    for (let i = startDate; i <= endDate; i++) {
        headerCells.push(<td className="borderCell dayCell text-center" key={'day_' + i}>{i}</td>)
    }
    rosterSchedulerData.itoIdList.forEach(itoId => {
        let cells = [];
        cells.push(<NameCell key={"name_" + itoId}>{rosterSchedulerData.roster[itoId].itoName}</NameCell>);
        for (let i = startDate; i <= endDate; i++) {
            cells.push(
                <ShiftCell key={"shift_" + itoId + "_" + i}>
                    {planResult[itoId].shiftList[i][0].shiftType}
                </ShiftCell>
            )
        }
        bodyRows.push(
            <tr key={"row_" + itoId}>
                {cells}
            </tr>
        );
    });
    console.log(planResult.duplicateShiftList);
    console.log(planResult.vacantShiftList);
    
    return (
        <table className="m-1 p-0 rosterTable">
            <thead>
                <tr>
                    {headerCells}
                </tr>
            </thead>
            <tbody>
                {bodyRows}
            </tbody>
        </table>
    )
}