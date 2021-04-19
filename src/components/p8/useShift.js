export default function useShift() {
    const getITOStat = (activeShiftInfo, noOfWorkingDay, itoRoster) => {
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
            if (activeShiftInfo[shiftType]) {
              actualWorkingHour += activeShiftInfo[shiftType].duration;
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
    const updateTableData=(activeShiftInfo, noOfWorkingDay,rosterData)=>{
      Object.keys(rosterData).forEach(itoId=>{
        let input={};
        let itoRoster=rosterData[itoId];
        input.workingHourPerDay=itoRoster.workingHourPerDay;
        input.lastMonthBalance=Number(document.getElementById(itoId+"_lastMonthBalance").textContent);
        input.availableShiftList=itoRoster.availableShiftList;
        input.shiftList={};
        for (let i=1;i<32;i++){
          let cell=document.getElementById(itoId+"_shift_"+i);
          if (cell){
            input.shiftList[i]=cell.textContent;
          } else {
            break;
          }
        }
        let itoStat=getITOStat(activeShiftInfo, noOfWorkingDay,input);
        document.getElementById(itoId+"_expectedWorkingHour").innerHTML=itoStat.expectedWorkingHour.toFixed(2);
        document.getElementById(itoId+"_actualWorkingHour").innerHTML=itoStat.actualWorkingHour.toFixed(2);
        document.getElementById(itoId+"_lastMonthBalance").innerHTML=itoStat.lastMonthBalance.toFixed(2);
        document.getElementById(itoId+"_thisMonthBalance").innerHTML=itoStat.thisMonthBalance.toFixed(2)
        document.getElementById(itoId+"_totalBalance").innerHTML=itoStat.totalBalance.toFixed(2);
        document.getElementById(itoId+"_aShiftCount").innerHTML=itoStat.shiftCountList.aShiftCount;
        document.getElementById(itoId+"_bxShiftCount").innerHTML=itoStat.shiftCountList.bxShiftCount;
        document.getElementById(itoId+"_cShiftCount").innerHTML=itoStat.shiftCountList.cShiftCount;
        document.getElementById(itoId+"_dsShiftCount").innerHTML=itoStat.shiftCountList.dxShiftCount;
        document.getElementById(itoId+"_actualWorkingDayCount").innerHTML=itoStat.actualWorkingDayCount;
      })
    };
    return [getITOStat,getShiftCountList,updateTableData];
}
  