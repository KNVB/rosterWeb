export default class AutoPlannerUtil {
    constructor() {
        let iterationCount = 100;

        let startDate = 10, endDate;
        this.autoPlan = (rosterDataUtil, systemParam) => {
            let activeShiftList = rosterDataUtil.getActiveShiftList();
            let availableShiftList, essentialShift = '';
            let isAssigned, itoId, itoIdList = rosterDataUtil.getItoIdList();
            let preferredShift, previousShiftList = {}, rosterList;
            let resultantRoster = {}, resultantRosterList = {};

            console.log(activeShiftList);
            console.log(systemParam);
            console.log(itoIdList);
            let dateIndex = parseInt(startDate);
            //itoId = "ITO1_1999-01-01";
            itoId = "ITO6_1999-01-01";
            //itoId = "ITO4_1999-01-01";
            isAssigned = false;
            essentialShift = activeShiftList.essentialShift;
            rosterList = rosterDataUtil.getRosterList(itoId);
            console.log(rosterList);
            if (resultantRosterList[itoId]) {
                resultantRoster = resultantRosterList[itoId];
            } else {
                resultantRoster = {
                    availableShiftList: rosterList.availableShiftList,
                    shiftList: {},
                    workingHourPerDay: rosterList.workingHourPerDay
                }
            }
            console.log("startDate=" + startDate);
            previousShiftList = getPreviousShiftList(dateIndex, rosterList, resultantRoster, systemParam);
            if (rosterList.preferredShiftList[dateIndex]) {
                preferredShift = rosterList.preferredShiftList[dateIndex];
            } else {
                preferredShift = '';
            }
            console.log(previousShiftList);
            switch (preferredShift) {
                case "o":
                    resultantRoster.shiftList[dateIndex] = "O";
                    previousShiftList.shift();
                    previousShiftList.push("O");
                    isAssigned = true;
                    break;
                case "d":
                case "d1":
                case "d2":
                case "d3":
                    resultantRoster.shiftList[dateIndex] = preferredShift;
                    previousShiftList.shift();
                    previousShiftList.push(preferredShift);
                    isAssigned = true;
                    break;
                default:
                    if ((preferredShift !== '') && isThatShiftOkForAssign(previousShiftList, rosterList, resultantRoster.shiftList, systemParam, preferredShift)) {
                        if (essentialShift.indexOf(preferredShift) > -1) {
                            essentialShift = essentialShift.replace(preferredShift, "");
                        }
                        resultantRoster.shiftList[dateIndex] = preferredShift;
                        previousShiftList.shift();
                        previousShiftList.push(preferredShift);
                        isAssigned = true;
                    }
                    break;
            }
        }

        this.getIterationCount = () => {
            return iterationCount;
        }
        this.getEndDate = () => {
            return endDate;
        }
        this.getStartDate = () => {
            return startDate;
        }
        this.setEndDate = e => {
            endDate = e;
        }
        this.setIterationCount = (newCount) => {
            iterationCount = newCount;
        }
        this.setStartDate = s => {
            startDate = s;
        }
        //===============================================================================================
        let getNoOfConsecutiveWorkingDay = (previousShiftList, thatShift) => {
            let count = 0;
            let shiftList = JSON.parse(JSON.stringify(previousShiftList));
            shiftList.push(thatShift);
            for (var i = 0; i < shiftList.length; i++) {
                switch (shiftList[i]) {
                    case "":
                    case "O":
                    case "d":
                    case "d1":
                    case "d2":
                    case "d3":
                    case null:
                        count = 0;
                        break;
                    default:
                        count++;
                        break;
                }
            }
            //console.log(ito.itoId,previousShiftList,shiftList,thatShift,count,this.maxConsecutiveWorkingDay);
            return count;
        }
        let getPreviousShiftList = (dateIndex, rosterList, resultantRoster, systemParam) => {
            let result = [];
            let sDate = dateIndex - systemParam.maxConsecutiveWorkingDay;
            let lastMonthIndex = systemParam.maxConsecutiveWorkingDay + sDate;
            //console.log("sDate=" + sDate);
            //console.log("lastMonthIndex=" + lastMonthIndex);
            if (sDate < 0) {
                for (let i = lastMonthIndex; i < systemParam.maxConsecutiveWorkingDay; i++) {
                    result.push(rosterList.previousMonthShiftList[i]);
                }
                for (let i = 1; i < dateIndex; i++) {
                    result.push(rosterList.shiftList[i]);
                }
            } else {
                for (let i = sDate + 1; i < dateIndex; i++) {
                    if (resultantRoster.shiftList[i]) {
                        result.push(resultantRoster.shiftList[i]);
                    } else {
                        result.push(rosterList.shiftList[i]);
                    }
                }
            }
            return result;
        }
        let getTotalNoOfThatShiftAssigned = (shiftList, thatShift) => {
            let count = 0;
            for (let [, shift] of Object.entries(shiftList)) {
                if (shift === thatShift)
                    count++;
            };
            return count;
        }

        let isThatShiftFormBlackListedShiftPattern = (rosterList, previousShiftList, thatShift) => {
            let blackListShift, result = false, shiftPattern = [], temp;
            previousShiftList.forEach(shift => {
                if (shift) {
                    shiftPattern.push(shift)
                }
            });
            shiftPattern.push(thatShift);
            temp = shiftPattern.join("");
            for (let i = 0; i < rosterList.blackListShiftPatternList.length; i++) {
                blackListShift = rosterList.blackListShiftPatternList[i].replace(",", "");
                if (temp.includes(blackListShift.replace(",", ""))) {
                    result = true;
                    break;
                }
            }
            return result;
        }
        let isThatShiftOkForAssign = (previousShiftList, rosterList, shiftList, systemParam, thatShift) => {
            let result = false;
            if (getNoOfConsecutiveWorkingDay(previousShiftList, thatShift) < systemParam.maxConsecutiveWorkingDay) {
                if (!isThatShiftFormBlackListedShiftPattern(rosterList, previousShiftList, thatShift)) {
                    console.log(getTotalNoOfThatShiftAssigned(shiftList, thatShift));
                }
            }
            return result;
        }
    }
}