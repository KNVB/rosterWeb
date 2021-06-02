import {useContext} from 'react';
import AdminUtility from '../utils/AdminUtility';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function ExportToExcelButton(){
    let [contextValue] = useContext(RosterWebContext);
    let genExcelData={},shiftInfoList={};
    function exportExcel(){
       for (let shift in contextValue.activeShiftInfoList){
        if (shift!=='essentialShift'){
            let shiftInfo=contextValue.activeShiftInfoList[shift];
            shiftInfoList[shift]={
                                    duration:shiftInfo.duration,
                                };
        }
       }
       genExcelData["monthlyCalendar"]=contextValue.monthlyCalendar;
       genExcelData["rosterList"]=contextValue.itoRosterList.presentValue;
       genExcelData["rosterMonth"]=contextValue.rosterMonth.getMonth();
       genExcelData["rosterYear"]=contextValue.rosterMonth.getFullYear();
       genExcelData["shiftInfoList"]=shiftInfoList;
       genExcelData["vacantShiftList"]=contextValue.allITOStat.vacantShiftList;
       console.log(genExcelData);
       let adminRoster=new AdminUtility(contextValue.changeLoggedInFlag);
       adminRoster.exportExcel(genExcelData);
    }
    return (
        <div className="exportButton" onClick={exportExcel}>
            Export to Excel File
        </div>
    )
}