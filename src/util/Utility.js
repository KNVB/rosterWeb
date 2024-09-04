import AdminShiftStatUtil from "./AdminShiftStatUtil";
import ITOShiftStatUtil from "./ITOShiftStatUtil";

export class Utility{    
    static genITOStat=(activeShiftList,roster,noOfWorkingDay,timeOffList)=>{
        let { getITOStat } = ITOShiftStatUtil();
        let result={};
       
        let itoIdList=Object.keys(roster);
        for (let i=0; i< itoIdList.length;i++){
            let itoId=itoIdList[i];
            result[itoId]=getITOStat(activeShiftList,noOfWorkingDay,roster[itoId],timeOffList[itoId].total);
        }
        return result;
    }
    static getAllITOStat= (activeShiftList, startDate, endDate, rosterRow) => {
        let { getAllITOStat } = AdminShiftStatUtil();
        return getAllITOStat(activeShiftList, startDate, endDate, rosterRow);
    }
}