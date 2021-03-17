import {useContext} from 'react';
import RosterWebContext from '../../../../RosterWebContext';
export default function ExportToExcelButton(){
    let {monthlyCalendar,rosterData} = useContext(RosterWebContext);
    function exportExcel(){
        console.log(monthlyCalendar);
        console.log(rosterData.rosterList);
        console.log(rosterData.vacantShiftList);
    }
    return (
        <div className="exportButton" onClick={exportExcel}>
            Export to Excel File
        </div>
    )
}