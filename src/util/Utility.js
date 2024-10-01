import AdminShiftStatUtil from "./AdminShiftStatUtil";
import ITOShiftStatUtil from "./ITOShiftStatUtil";

export default class Utility{
    static dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    static dateTimeFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });    
    static genITOStat=(activeShiftList,roster,noOfWorkingDay)=>{
        let { getITOStat } = ITOShiftStatUtil();
        let result={};
       
        let itoIdList=Object.keys(roster);
        for (let i=0; i< itoIdList.length;i++){
            let itoId=itoIdList[i];
            result[itoId]=getITOStat(activeShiftList,noOfWorkingDay,roster[itoId]);
        }
        return result;
    }
    static getAllITOStat= (activeShiftList, startDate, endDate, rosterRow) => {
        let { getAllITOStat } = AdminShiftStatUtil();
        return getAllITOStat(activeShiftList, startDate, endDate, rosterRow);
    }
}