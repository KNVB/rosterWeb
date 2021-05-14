import ITOShiftStatUtil from './ITOShiftStatUtil';
export default function AdminShiftStatUtil(){
    const getAllITOStat = (activeShiftInfoList, noOfWorkingDay, rosterData)=>{
        let itoStat,result={};
        let aShiftCount = [],    bxShiftCount = [],    cShiftCount = [],    dxShiftCount = [];
        let {getITOStat}=ITOShiftStatUtil();
        
        Object.keys(rosterData).forEach(itoId=>{
            let itoRoster=rosterData[itoId].rosterList;
            itoStat=getITOStat(activeShiftInfoList,noOfWorkingDay,itoRoster);
            result[itoId]=itoStat;
            aShiftCount.push(itoStat.shiftCountList.aShiftCount);
            bxShiftCount.push(itoStat.shiftCountList.bxShiftCount);
            cShiftCount.push(itoStat.shiftCountList.cShiftCount);
        })
        let aShiftSD=calculateStdDev(aShiftCount);
        let bShiftSD=calculateStdDev(bxShiftCount);
        let cShiftSD=calculateStdDev(cShiftCount);
        let avgStdDev=(aShiftSD+bShiftSD+cShiftSD)/3;
        result.aShiftStdDev  = aShiftSD.toFixed(2);
        result.bxShiftStdDev = bShiftSD.toFixed(2);
        result.cShiftStdDev  = cShiftSD.toFixed(2);
        result.avgStdDev = avgStdDev.toFixed(2);
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