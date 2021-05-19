import ITOShiftStatUtil from './ITOShiftStatUtil';
export default function AdminShiftStatUtil(){
    const getAllITOStat = (activeShiftInfoList, monthlyCalendar, rosterData)=>{
        let duplicatShift=[];
        let aShiftCount = [],    bxShiftCount = [],    cShiftCount = [];
        let itoStat,roster,result={},shiftType;
        let vacantShift,vacantShiftList={};
        let {getITOStat}=ITOShiftStatUtil();
        let itoId,itoIdList=Object.keys(rosterData);

        for (let i=0;i<itoIdList.length;i++){
            itoId=itoIdList[i];
            let itoRoster=rosterData[itoId];
            getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,itoRoster);
            
            itoRoster.duplicatShiftList=[];
            aShiftCount.push(itoRoster.shiftCountList.aShiftCount);
            bxShiftCount.push(itoRoster.shiftCountList.bxShiftCount);
            cShiftCount.push(itoRoster.shiftCountList.cShiftCount);
        }
        for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
            vacantShift = activeShiftInfoList.essentialShift;
            duplicatShift=[];

            for (let y=0;y<itoIdList.length;y++){
                itoId=itoIdList[y];
                roster=rosterData[itoId];
                if (roster.shiftList[i+1]){
                    let shiftTypeList = roster.shiftList[i+1].split("+");
                    for (let j=0;j<shiftTypeList.length;j++){
                        shiftType=shiftTypeList[j];
                        if (roster.availableShiftList.includes(shiftType)){
                            if (shiftType === "b1") {
                                vacantShift = vacantShift.replace("b", "");
                            } else {
                                vacantShift = vacantShift.replace(shiftType, "");
                            }

                            switch (shiftType){
                                case "a" :                 
                                case "c" :if (duplicatShift.includes(shiftType)){
                                            roster.duplicatShiftList.push(i+1);
                                          } else {
                                            duplicatShift.push(shiftType);
                                          }
                                          break;
                                case "b" :
                                case "b1":if (duplicatShift.includes("b")){
                                            roster.duplicatShiftList.push(i+1);
                                          }else {
                                            duplicatShift.push('b');
                                          }
                                          break;      
                                default:break;          
                            }
                        }
                    }
                }
            }
            if (vacantShift!==''){
                vacantShiftList[i+1]=vacantShift;
            }
        }    
        let aShiftSD=calculateStdDev(aShiftCount);
        let bShiftSD=calculateStdDev(bxShiftCount);
        let cShiftSD=calculateStdDev(cShiftCount);
        let avgStdDev=(aShiftSD+bShiftSD+cShiftSD)/3;
        result.aShiftStdDev  = aShiftSD.toFixed(2);
        result.bxShiftStdDev = bShiftSD.toFixed(2);
        result.cShiftStdDev  = cShiftSD.toFixed(2);
        result.avgStdDev = avgStdDev.toFixed(2);        
        result.vacantShiftList=vacantShiftList;        
        return result;
    }
    const calculateMean=(data)=>{
        return data.reduce(function (a, b) {
            return Number(a) + Number(b);
        }) / data.length;
    }
    const calculateStdDev=(data)=>{
        let m =calculateMean(data);
      return Math.sqrt(data.reduce(function (sq, n) {
              return sq + Math.pow(n - m, 2);
          }, 0) / (data.length - 1));
    } 
    return {getAllITOStat};
}