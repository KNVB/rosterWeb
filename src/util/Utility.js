export default class Utility {
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
    static buildPreShift = (dateOfMonth, essentialShift, itoRoster, systemParam) => {
        let preShift = [];
        for (let j = dateOfMonth - systemParam.noOfPrevDate; j < dateOfMonth; j++) {
            if (itoRoster.shiftList[j]) {
                let shiftObj = itoRoster.shiftList[j];
                if ((essentialShift.indexOf(shiftObj) > -1) ||
                    (shiftObj === "O")
                ) {
                    preShift.push(shiftObj);
                }
            }
        }
        preShift = preShift.join(",");
        return preShift
    }
    static initRoster = (monthlyCalendar, rosterData, rosterMonth) => {
        let result = {};
        let itoIdList = Object.keys(rosterData);
        for (let i = 0; i < itoIdList.length; i++) {
            let itoRoster = structuredClone(rosterData[itoIdList[i]]);
            itoRoster.actualWorkingDayCount = 0;
            itoRoster.actualWorkingHour = 0.0;
            itoRoster.aShiftCount = 0; itoRoster.bxShiftCount = 0;
            itoRoster.cShiftCount = 0; itoRoster.dxShiftCount = 0;
            itoRoster.totalBalance = 0; itoRoster.joinDate = new Date(itoRoster.joinDate);
            itoRoster.expectedWorkingHour = Utility.getExpectedWorkingHour(itoRoster, rosterMonth, monthlyCalendar);
            result[itoIdList[i]] = itoRoster;
        }
        return result;
    }
    static isBlackListShift = (itoBlackListShiftPattern, itoId, newShift) => {
        let result = false;
        if (itoBlackListShiftPattern[itoId]) {
            for (let i = 0; i < itoBlackListShiftPattern[itoId].length; i++) {
                let blackListShift = itoBlackListShiftPattern[itoId][i];
                if (newShift.indexOf(blackListShift) > -1) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
    /*
    static genITOStat = (activeShiftList, noOfWorkingDay, roster, nonStandardWorkingHourSummary) => {
        let result = {};
        let itoIdList = Object.keys(roster);
        for (let i = 0; i < itoIdList.length; i++) {
            let itoRoster = structuredClone(roster[itoIdList[i]]);
            itoRoster.actualWorkingDayCount = 0;
            itoRoster.actualWorkingHour = 0.0;
            itoRoster.aShiftCount = 0; itoRoster.bxShiftCount = 0;
            itoRoster.cShiftCount = 0; itoRoster.dxShiftCount = 0;
            itoRoster.expectedWorkingHour = itoRoster.workingHourPerDay * noOfWorkingDay;
            itoRoster.totalBalance = 0;
            Object.keys(itoRoster.shiftList).forEach(date => {
                let item = itoRoster.shiftList[date];
                let shiftTypeList = item.split("+");
                shiftTypeList.forEach(shiftType => {
                    if (itoRoster.availableShiftList.includes(shiftType)) {
                        if (activeShiftList[shiftType]) {
                            itoRoster.actualWorkingHour += activeShiftList[shiftType].duration;
                            switch (shiftType) {
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
                                default:
                                    break
                            }
                        }
                    }
                });
            });            
            itoRoster.thisMonthBalance = itoRoster.actualWorkingHour - itoRoster.expectedWorkingHour;
            itoRoster.totalBalance += itoRoster.lastMonthBalance + itoRoster.thisMonthBalance;
            itoRoster.totalBalance += nonStandardWorkingHourSummary[itoIdList[i]];
            result[itoIdList[i]] = itoRoster;
        }
        return result;
    }*/

    static getExpectedWorkingHour = (itoRoster, firstDayObj, monthlyCalendar) => {
        let result = monthlyCalendar.noOfWorkingDay;
        if (itoRoster.joinDate > firstDayObj) {
            for (let i = 0; i < (itoRoster.joinDate.getDate() - 1); i++) {
                let calendarDate = monthlyCalendar.calendarDateList[i];
                if ((calendarDate.dayOfWeek > 0) &&
                    (calendarDate.dayOfWeek < 6) &&
                    (!calendarDate.isPublicHoliday)) {
                    result--;
                }
            }
        }
        result *= itoRoster.workingHourPerDay;
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
                //console.log("dateOfMonth="+i+"itoId="+itoId+",shiftList="+JSON.stringify(roster[itoId].shiftList[i]));
                //console.log(itoId,shiftInfoList,i);
                shiftInfoList = shiftInfoList.split("+");
                shiftInfoList.forEach(shiftInfo => {
                    if (shiftInfo === "b1") {
                        vacantShift = vacantShift.replace("b", "");
                    } else {
                        vacantShift = vacantShift.replace(shiftInfo, "");
                    }
                    switch (shiftInfo) {
                        case "a":
                        case "c":
                            if (assignedShiftList.includes(shiftInfo)) {
                                duplicateShiftList[itoId].push(i);
                            } else {
                                assignedShiftList.push(shiftInfo);
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
    static updateITOStat = (activeShiftList, roster, nonStandardWorkingHourSummary) => {
        Object.keys(roster).forEach(itoId => {
            let itoRoster = roster[itoId];
            itoRoster.actualWorkingDayCount = 0;
            itoRoster.actualWorkingHour = 0.0;
            itoRoster.aShiftCount = 0; itoRoster.bxShiftCount = 0;
            itoRoster.cShiftCount = 0; itoRoster.dxShiftCount = 0;
            itoRoster.totalBalance = 0;
            Object.keys(itoRoster.shiftList).forEach(date => {
                let item = itoRoster.shiftList[date];
                let shiftTypeList = item.split("+");
                shiftTypeList.forEach(shiftType => {
                    if (itoRoster.availableShiftList.includes(shiftType)) {
                        if (activeShiftList[shiftType]) {
                            itoRoster.actualWorkingHour += activeShiftList[shiftType].duration;
                            switch (shiftType) {
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
                                default:
                                    break
                            }
                        }
                    }
                });
            });
            itoRoster.thisMonthBalance = itoRoster.actualWorkingHour - itoRoster.expectedWorkingHour;
            itoRoster.totalBalance += itoRoster.lastMonthBalance + itoRoster.thisMonthBalance;
            itoRoster.totalBalance += nonStandardWorkingHourSummary[itoId];
        });
    }
    static shuffleArray(arr) {
        for (let i = 0; i < arr.length; i++) {
            let a = arr[i];
            let b = Math.floor(Math.random() * arr.length);
            arr[i] = arr[b];
            arr[b] = a;
        }
    }
}