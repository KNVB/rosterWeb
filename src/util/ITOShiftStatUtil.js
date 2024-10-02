export default function ITOShiftStatUtil() {
  const getITOStat = (activeShiftInfoList, noOfWorkingDay, inITORoster) => {
    let itoRoster =  structuredClone(inITORoster);
    itoRoster.expectedWorkingHour = itoRoster.workingHourPerDay * noOfWorkingDay;
    itoRoster.actualWorkingHour = 0.0;
    Object.keys(itoRoster.shiftList).forEach(date => {
      if (itoRoster.shiftList[date]) {
        let item = itoRoster.shiftList[date];
        let shiftTypeList = item.split("+");
        shiftTypeList.forEach(shiftType => {
          if (itoRoster.availableShiftList.includes(shiftType)) {
            if (activeShiftInfoList[shiftType]) {
              itoRoster.actualWorkingHour += activeShiftInfoList[shiftType].duration;
            }
          }
        });
      }
    });
    itoRoster.shiftCountList = getShiftCountList(itoRoster);
    itoRoster.actualWorkingDayCount = itoRoster.shiftCountList.aShiftCount
      + itoRoster.shiftCountList.bxShiftCount
      + itoRoster.shiftCountList.cShiftCount
      + itoRoster.shiftCountList.dxShiftCount;  
    itoRoster.thisMonthBalance = itoRoster.actualWorkingHour - itoRoster.expectedWorkingHour;
    itoRoster.totalBalance = itoRoster.lastMonthBalance + itoRoster.thisMonthBalance;
    itoRoster.totalBalance+=inITORoster.shiftDetail.total;
    //console.log(itoRoster.shiftDetail);
    
    Object.keys(itoRoster.shiftDetail.records).forEach(key=>{
      itoRoster.shiftDetail.records[key].forEach(item=>{
        item.endTime=new Date(item.endTime);
        item.startTime=new Date(item.startTime);
      });
    });
      
    return itoRoster;
  };
  const getShiftCountList = itoRoster => {
    let aShiftCount = 0,
      bxShiftCount = 0,
      cShiftCount = 0,
      dxShiftCount = 0;
    Object.keys(itoRoster.shiftList).forEach(key => {
      let item = itoRoster.shiftList[key];
      try {
        let shiftTypeList = item.split("+");
        shiftTypeList.forEach(shiftType => {
          if (itoRoster.availableShiftList.includes(shiftType)) {
            switch (shiftType) {
              case "a":
                aShiftCount++;
                break;
              case "b":
              case "b1":
                bxShiftCount++;
                break;
              case "c":
                cShiftCount++;
                break;
              case "d":
              case "d1":
              case "d2":
              case "d3":
                dxShiftCount++;
                break;
              default:
                break;
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
    return {
      aShiftCount: aShiftCount,
      bxShiftCount: bxShiftCount,
      cShiftCount: cShiftCount,
      dxShiftCount: dxShiftCount
    };
  };
  return { getITOStat, getShiftCountList };
}