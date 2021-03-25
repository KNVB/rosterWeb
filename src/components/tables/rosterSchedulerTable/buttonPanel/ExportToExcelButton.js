import {useContext} from 'react';
import Roster from '../../../../utils/Roster';
import RosterWebContext from '../../../../RosterWebContext';
export default function ExportToExcelButton(){
    let {activeShiftInfoList,monthlyCalendar,rosterData,rosterMonth} = useContext(RosterWebContext);
    let genExcelData={},shiftInfoList={};
    function exportExcel(){
        /*
        console.log(activeShiftInfoList);
        console.log(monthlyCalendar);
        console.log(rosterMonth);
        console.log(rosterData.rosterList);
        console.log(rosterData.vacantShiftList);
        */
       for (let shift in activeShiftInfoList){
        if (shift!=='essentialShift'){
            let shiftInfo=activeShiftInfoList[shift];
            let element=document.querySelector("."+shiftInfo.cssClassName);
            let style = getComputedStyle(element);

            let colors=style.backgroundColor.replace("rgb(","").replace(")","").split(",");
            let colorCode="ff"+ Number(colors[0]).toString(16)+ Number(colors[1]).toString(16)+ Number(colors[2]).toString(16);
            shiftInfoList[shift]={
                                    "colorCode":colorCode,
                                    duration:shiftInfo.duration,
                                    timeSlot:shiftInfo.timeSlot
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