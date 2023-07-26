import AdminShiftStatUtil from "./AdminShiftStatUtil";
import ITOShiftStatUtil from "./ITOShiftStatUtil";

export class Utility{
    static doSorting = (data, sortByFieldName, sortingMethod) => {
        return data.sort((a, b) => {
            let result = 0;
            let temp0, temp1;
            if (typeof a[sortByFieldName] === 'number') {
                temp0 = String(a[sortByFieldName]);
                temp1 = String(b[sortByFieldName]);
            } else {
                temp0 = a[sortByFieldName].toLowerCase();
                temp1 = b[sortByFieldName].toLowerCase();
            }
            temp0 = temp0.replaceAll("<br>", "").trim();
            temp1 = temp1.replaceAll("<br>", "").trim();

            if (temp0 > temp1) {
                switch (sortingMethod) {
                    case "asc":
                        result = 1;
                        break;
                    case "desc":
                        result = -1;
                        break;
                    default:
                        break;
                }
            }
            if (temp0 < temp1) {
                switch (sortingMethod) {
                    case "asc":
                        result = -1;
                        break;
                    case "desc":
                        result = 1;
                        break;
                    default:
                        break;
                }
            }
            //console.log(temp0,temp1,result);
            return result
        })
    }
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
    static getAllITOStat= (activeShiftList, startDate, endDate, rosterRow) => {
        let { getAllITOStat } = AdminShiftStatUtil();
        return getAllITOStat(activeShiftList, startDate, endDate, rosterRow);
    }
}