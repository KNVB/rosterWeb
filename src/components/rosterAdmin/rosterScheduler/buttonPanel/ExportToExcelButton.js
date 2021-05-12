import {useContext} from 'react';
import Roster from '../../../../utils/Roster';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function ExportToExcelButton(){
    let {activeShiftInfoList,monthlyCalendar,rosterData,rosterMonth} = useContext(RosterWebContext);
    let genExcelData={},shiftInfoList={};
    function exportExcel(){
       for (let shift in activeShiftInfoList){
        if (shift!=='essentialShift'){
            let shiftInfo=activeShiftInfoList[shift];
            shiftInfoList[shift]={
                                    duration:shiftInfo.duration,
                                };
        }
       }
       genExcelData["monthlyCalendar"]=monthlyCalendar;
       genExcelData["rosterList"]=rosterData.rosterList;
       genExcelData["rosterMonth"]=rosterMonth.getMonth();
       genExcelData["rosterYear"]=rosterMonth.getFullYear();
       genExcelData["shiftInfoList"]=shiftInfoList;
       genExcelData["vacantShiftList"]=rosterData.vacantShiftList;
       console.log(genExcelData);
       let roster=new Roster();
       roster.exportExcel(genExcelData);
    }
    return (
        <div className="exportButton" onClick={exportExcel}>
            Export to Excel File
        </div>
    )
}