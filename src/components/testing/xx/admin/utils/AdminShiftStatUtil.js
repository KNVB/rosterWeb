export default function AdminShiftStatUtil(){
    const getAllITOStat = (activeShiftInfoList, monthlyCalendar,inITORosterList)=>{
        let allITOStat; 
        let aShiftCount = [],    bxShiftCount = [],    cShiftCount = [];       
        let duplicatShiftList={};
        let itoId;
        let itoIdList=Object.keys(inITORosterList); 
        let shiftType,vacantShift,temp,vacantShiftList={};
        Object.keys(inITORosterList).forEach(itoId=>{
            duplicatShiftList[itoId]=[];
        })
        for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
            vacantShift = activeShiftInfoList.essentialShift;
            temp=[];
            for (let y=0;y<itoIdList.length;y++){
                itoId=itoIdList[y];                
                if (inITORosterList[itoId].shiftList[i+1]){
                    let shiftTypeList = inITORosterList[itoId].shiftList[i+1].split("+");
                    for (let j=0;j<shiftTypeList.length;j++){
                        shiftType=shiftTypeList[j];
                        if (inITORosterList[itoId].availableShiftList.includes(shiftType)){
                            if (shiftType === "b1") {
                                vacantShift = vacantShift.replace("b", "");
                            } else {
                                vacantShift = vacantShift.replace(shiftType, "");
                            }
                            switch (shiftType){
                                case "a" :                 
                                case "c" :if (temp.includes(shiftType)){
                                            duplicatShiftList[itoId].push(i+1);
                                          } else {
                                            temp.push(shiftType);
                                          }
                                          break;
                                case "b" :
                                case "b1":if (temp.includes("b")){
                                            duplicatShiftList[itoId].push(i+1);
                                          }else {
                                            temp.push('b');
                                          }
                                          break;      
                                default:break;          
                            }
                        }
                    }
                }
                aShiftCount.push(inITORosterList[itoId].shiftCountList.aShiftCount);
                bxShiftCount.push(inITORosterList[itoId].shiftCountList.bxShiftCount);
                cShiftCount.push(inITORosterList[itoId].shiftCountList.cShiftCount);
            }
            if (vacantShift!==''){
                vacantShiftList[i+1]=vacantShift;
            }            
        }
        let aShiftSD=calculateStdDev(aShiftCount);
        let bShiftSD=calculateStdDev(bxShiftCount);
        let cShiftSD=calculateStdDev(cShiftCount);
        let avgStdDev=(aShiftSD+bShiftSD+cShiftSD)/3;

        /*
        console.log(aShiftSD);
        console.log(bShiftSD);
        console.log(cShiftSD);
        console.log(avgStdDev);
        */
       
        allITOStat={
            aShiftStdDev:aShiftSD.toFixed(2),
            bxShiftStdDev:bShiftSD.toFixed(2),
            cShiftStdDev:cShiftSD.toFixed(2),
            duplicatShiftList:duplicatShiftList,
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