export default class Utility {
    static autoPlan=({
        endDate,
        essentialShift,        
        itoIdList,
        iterationCount,
        preferredShiftList,
        previousMonthShiftList,
        roster,
        startDate,
        systemParam,
    })=>{
        /*console.log(
            {
                endDate,
                essentialShift,
                itoIdList,
                iterationCount,
                preferredShiftList,
                previousMonthShiftList,
                roster,
                startDate,
                systemParam,
            }
        );*/
        let tempResult={};
        let previousMonthShiftCount=(systemParam.noOfPrevDate-startDate)+1;
        itoIdList.forEach(itoId=>{
            tempResult[itoId]=[];
        });
        console.log(tempResult,previousMonthShiftCount)
        /*
        Utility.shuffleArray(itoIdList);
        console.log(itoIdList);
        */
    }
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
    static genITOStat = (activeShiftList, roster, noOfWorkingDay) => {
        let result = {};
        let itoIdList = Object.keys(roster);
        for (let i = 0; i < itoIdList.length; i++) {
            let itoRoster = structuredClone(roster[itoIdList[i]]);
            itoRoster.actualWorkingDayCount = 0;
            itoRoster.actualWorkingHour = 0.0;
            itoRoster.aShiftCount = 0; itoRoster.bxShiftCount = 0;
            itoRoster.cShiftCount = 0; itoRoster.dxShiftCount = 0;
            itoRoster.expectedWorkingHour = itoRoster.workingHourPerDay * noOfWorkingDay;
            itoRoster.extraHour = 0;
            itoRoster.totalBalance = 0;
            Object.keys(itoRoster.shiftList).forEach(date => {
                if (itoRoster.shiftList[date]) {
                    let itemList = itoRoster.shiftList[date];
                    itemList.forEach((item, itemIndex) => {
                        if (itoRoster.availableShiftList.includes(item.shiftType)) {
                            if (activeShiftList[item.shiftType]) {
                                itoRoster.actualWorkingHour += activeShiftList[item.shiftType].duration;
                            }
                            switch (item.shiftType) {
                                case "a":
                                    itoRoster.aShiftCount++;
                                    itoRoster.actualWorkingDayCount++;
                                    break;
                                case "b":
                                case "b1":
                                    itoRoster.bxShiftCount++;
                                    itoRoster.actualWorkingDayCount++
                                    break;
                                case "c":
                                    itoRoster.cShiftCount++;
                                    itoRoster.actualWorkingDayCount++
                                    break;
                                case "d":
                                case "d1":
                                case "d2":
                                case "d3":
                                    itoRoster.dxShiftCount++;
                                    itoRoster.actualWorkingDayCount++
                                    break;
                                case "t":
                                    itoRoster.shiftList[date][itemIndex].endTime = new Date(item.endTime);
                                    itoRoster.shiftList[date][itemIndex].startTime = new Date(item.startTime);
                                    if (item.claimType === "timeOff") {
                                        itoRoster.totalBalance -= item.duration;
                                        itoRoster.extraHour -= item.duration;
                                    } else {
                                        itoRoster.totalBalance += item.duration;
                                        itoRoster.extraHour += item.duration;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    })
                }
            });
            itoRoster.thisMonthBalance = itoRoster.actualWorkingHour - itoRoster.expectedWorkingHour;
            itoRoster.totalBalance += itoRoster.lastMonthBalance + itoRoster.thisMonthBalance;
            result[itoIdList[i]] = itoRoster;
        }
        return result;
    }
    static getAllITOStat = (essentialShift, startDate, endDate, itoIdList, roster) => {
        let blackListShiftList = {};
        let duplicateShiftList = {};
        let vacantShiftList = {};
  
        itoIdList.forEach(itoId => {
            blackListShiftList[itoId] = [];
            duplicateShiftList[itoId] = [];
        });
        for (let i = startDate; i <= endDate; i++) {
            let vacantShift = essentialShift;
            let assignedShiftList = [];
            itoIdList.forEach(itoId => {
                let shiftInfoList = roster[itoId].shiftList[i];
                if (shiftInfoList) {
                    shiftInfoList.forEach(shiftInfo => {
                        if (shiftInfo.shiftType === "b1") {
                            vacantShift = vacantShift.replace("b", "");
                        } else {
                            vacantShift = vacantShift.replace(shiftInfo.shiftType, "");
                        }
                        switch (shiftInfo.shiftType) {
                            case "a":
                            case "c":
                                if (assignedShiftList.includes(shiftInfo.shiftType)) {
                                    duplicateShiftList[itoId].push(i);
                                } else {
                                    assignedShiftList.push(shiftInfo.shiftType);
                                }
                                break;
                            case "b":
                            case "b1":
                                if (assignedShiftList.includes("b")) {
                                    duplicateShiftList[itoId].push(i);
                                } else {
                                    assignedShiftList.push('b');
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
            if (vacantShift !== '') {
                vacantShiftList[i] = vacantShift;
            }
        }

        return {
            blackListShiftList,
            duplicateShiftList,
            vacantShiftList
        }
    }
    static getDurationInHour = (startTime, endTime) => {
        return (endTime - startTime) / 1000 / 3600
    }
    static shuffleArray(arr)
    {
    	for (let i = 0; i < arr.length; i++){
            let a = arr[i];
            let b = Math.floor(Math.random() * arr.length);
            arr[i] = arr[b];
            arr[b] = a;
        }        
    }	
}