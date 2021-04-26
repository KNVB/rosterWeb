export default function useShift() {
    const getITOStat = (activeShiftInfoList, noOfWorkingDay, itoRoster) => {
      let actualWorkingHour = 0.0,actualWorkingDayCount = 0;
      let expectedWorkingHour = 0.0;
      let lastMonthBalance = itoRoster.lastMonthBalance;
      let thisMonthBalance = 0.0,totalBalance=0.0;
      expectedWorkingHour = itoRoster.workingHourPerDay * noOfWorkingDay;
      Object.keys(itoRoster.shiftList).forEach(date => {
        let item = itoRoster.shiftList[date];
        let shiftTypeList = item.split("+");
        shiftTypeList.forEach(shiftType => {
          if (itoRoster.availableShiftList.includes(shiftType)) {
            if (activeShiftInfoList[shiftType]) {
              actualWorkingHour += activeShiftInfoList[shiftType].duration;
            }
          }
        });
      });
      let shiftCountList = getShiftCountList(itoRoster);
      actualWorkingDayCount=shiftCountList.aShiftCount+shiftCountList.bxShiftCount+shiftCountList.cShiftCount+shiftCountList.dxShiftCount;
      thisMonthBalance=actualWorkingHour - expectedWorkingHour;
      totalBalance=lastMonthBalance + thisMonthBalance;
      return {
        actualWorkingHour,
        actualWorkingDayCount,
        shiftCountList,
        expectedWorkingHour,
        lastMonthBalance,
        thisMonthBalance,
        totalBalance
      };
    };
    const getShiftCountList = itoRoster => {
      let aShiftCount = 0,
        bxShiftCount = 0,
        cShiftCount = 0,
        dxShiftCount = 0;
      Object.keys(itoRoster.shiftList).forEach(key => {
        let item = itoRoster.shiftList[key];
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
      });
      return {
        aShiftCount: aShiftCount,
        bxShiftCount: bxShiftCount,
        cShiftCount: cShiftCount,
        dxShiftCount: dxShiftCount
      };
    };
    return {getITOStat,getShiftCountList};
}
  