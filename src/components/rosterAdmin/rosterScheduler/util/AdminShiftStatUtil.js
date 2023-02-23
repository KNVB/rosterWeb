export default function AdminShiftStatUtil(){
    const getAllITOStat = (activeShiftInfoList, startDate,endDate,inITORosterList)=>{
        let allITOStat={};
        let aShiftCount = [],    bxShiftCount = [],    cShiftCount = [];
        let shiftType,vacantShift,temp,vacantShiftList={};
        let itoIdList=Object.keys(inITORosterList); 
        for (let i=startDate;i<=endDate;i++){
            vacantShift = activeShiftInfoList.essentialShift;
            temp=[];
            itoIdList.forEach((itoId,index)=>{
                let itoRoster=inITORosterList[itoId];
                let shiftTypeList = itoRoster.shiftList[i].split("+");
                shiftTypeList.forEach(shiftType=>{
                    if (shiftType === "b1") {
                        vacantShift = vacantShift.replace("b", "");
                    } else {
                        vacantShift = vacantShift.replace(shiftType, "");
                    }
                });
            });
            if (vacantShift!==''){
                vacantShiftList[i]=vacantShift;
            }
        }
        itoIdList.forEach((itoId,index)=>{
            aShiftCount.push(inITORosterList[itoId].shiftCountList.aShiftCount);
            bxShiftCount.push(inITORosterList[itoId].shiftCountList.bxShiftCount);
            cShiftCount.push(inITORosterList[itoId].shiftCountList.cShiftCount);
        });        
        
        let aShiftSD=calculateStdDev(aShiftCount);
        let bShiftSD=calculateStdDev(bxShiftCount);
        let cShiftSD=calculateStdDev(cShiftCount);
        let avgStdDev=(aShiftSD+bShiftSD+cShiftSD)/3;
        allITOStat={
            aShiftStdDev:aShiftSD.toFixed(2),
            bxShiftStdDev:bShiftSD.toFixed(2),
            cShiftStdDev:cShiftSD.toFixed(2),            
            avgStdDev:avgStdDev.toFixed(2),
            vacantShiftList:vacantShiftList
        }        
        return allITOStat
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