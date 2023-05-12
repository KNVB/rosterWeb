import ITOShiftStatUtil from "./ITOShiftStatUtil";
export class Utility{
    static genITOStat=(roster,noOfWorkingDay)=>{
        let { getITOStat } = ITOShiftStatUtil();
        let result={};
       
        let itoIdList=Object.keys(roster.rosterRow);
        for (let i=0; i< itoIdList.length;i++){
            let itoId=itoIdList[i];
            result[itoId]=getITOStat(roster.activeShiftList,noOfWorkingDay,roster.rosterRow[itoId]);
        }
        
        return result;
    }
}