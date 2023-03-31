import AdminShiftStatUtil from './AdminShiftStatUtil';
import ITOShiftStatUtil from "../../../../util/ITOShiftStatUtil";
export default class AutoPlannerUtil {
    constructor() {
        let iterationCount = 100;

        let startDate = 1, endDate;
        this.autoPlan = (noOfWorkingDay, rosterDataUtil, systemParam) => {
            if (startDate > endDate) {
                throw new Error("Invalid start date or end date selection");
            } else {
                let finalResult = [], tempResult = [];
                for (let i = 0; i < iterationCount; i++) {
                    tempResult.push(this.genResult(noOfWorkingDay, rosterDataUtil, systemParam));
                }
                tempResult.sort(sortByVacantShiftCount);
                let j = ((tempResult.length > 3) ? 3 : tempResult.length);
                for (let i = 0; i < j; i++) {
                    finalResult.push(tempResult[i]);
                }
                return finalResult;
            }
        }
        this.genResult = (noOfWorkingDay, rosterDataUtil, systemParam) => {
            let activeShiftList = rosterDataUtil.getActiveShiftList();
            let essentialShift = '';
            let itoId, itoIdList;
            let preferredShift, previousShiftList = {}, rosterList;
            let resultantRoster = {}, resultantRosterList = {};

            console.log(activeShiftList);
            console.log(systemParam);
            //console.log(itoIdList);
            for (let dateIndex = startDate; dateIndex <= endDate; dateIndex++) {
                console.log("dateIndex:"+dateIndex);
                essentialShift = activeShiftList.essentialShift;
                itoIdList = getShuffledItoIdList(rosterDataUtil.getItoIdList());
                for (let i = 0; i < itoIdList.length; i++) {
                    itoId = itoIdList[i];
                    rosterList = rosterDataUtil.getRosterList(itoId);
                    console.log(rosterList);
                    if (resultantRosterList[itoId]) {
                        resultantRoster = resultantRosterList[itoId];
                    } else {
                        resultantRoster = {
                            availableShiftList: rosterList.availableShiftList,
                            lastMonthBalance: rosterList.lastMonthBalance,
                            shiftList: {},
                            workingHourPerDay: rosterList.workingHourPerDay
                        }
                    }
                    
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
                            break;
                        case "d":
                        case "d1":
                        case "d2":
                        case "d3":
                            resultantRoster.shiftList[dateIndex] = preferredShift;
                            previousShiftList.shift();
                            previousShiftList.push(preferredShift);
                            break;
                        default:
                            let availableShift = [];
                            for (let a = 0; a < rosterList.availableShiftList.length; a++) {
                                if (isThatShiftOkForAssign(preferredShift, previousShiftList, rosterList, resultantRoster.shiftList, systemParam, rosterList.availableShiftList[a])) {
                                    availableShift.push(rosterList.availableShiftList[a]);
                                }
                            };
                            if ((essentialShift === '') || (availableShift.length === 0)) {
                                resultantRoster.shiftList[dateIndex] = "O";
                                previousShiftList.shift();
                                previousShiftList.push("O");
                            } else {
                                let comparetor = '', isAssigned = false;
                                for (let j = 0; j < availableShift.length; j++) {
                                    switch (availableShift[j]) {
                                        case "b1":
                                            comparetor = "b";
                                            break;
                                        default:
                                            comparetor = availableShift[j];
                                            break;
                                    }
                                    if (essentialShift.indexOf(comparetor) > -1) {
                                        essentialShift = essentialShift.replace(comparetor, "");
                                        resultantRoster.shiftList[dateIndex] = availableShift[j];
                                        previousShiftList.shift();
                                        previousShiftList.push(availableShift[j]);
                                        isAssigned = true;
                                        break;
                                    }
                                }
                                if (!isAssigned) {
                                    //	console.log(" O shift is assigned on day "+dateIndex);
                                    resultantRoster.shiftList[dateIndex] = "O";
                                    previousShiftList.shift();
                                    previousShiftList.push("O");
                                }
                            }
                            break;
                    }
                    resultantRosterList[itoId] = resultantRoster;
                }
                console.log("============================================================================================")
            }
            let { getITOStat } = ITOShiftStatUtil();
            let { getAllITOStat } = AdminShiftStatUtil();
            itoIdList.forEach(itoId => {
                let rosterInfo = getITOStat(activeShiftList, noOfWorkingDay, resultantRosterList[itoId]);
                resultantRosterList[itoId] = rosterInfo;
            })
            let temp = getAllITOStat(activeShiftList, startDate, endDate, resultantRosterList);
            resultantRosterList.duplicateShiftList = temp.duplicateShiftList;
            resultantRosterList.vacantShiftList = temp.vacantShiftList;
            resultantRosterList.vacantShiftCount = Object.keys(temp.vacantShiftList).length;
            return resultantRosterList;
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
            endDate = parseInt(e);
        }
        this.setIterationCount = (newCount) => {
            iterationCount = newCount;
        }
        this.setStartDate = s => {
            startDate = parseInt(s);
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
            switch (thatShift) {
                case "d":
                case "d1":
                case "d2":
                case "d3":
                case "o":
                    break;
                default:
                    for (let [, shift] of Object.entries(shiftList)) {
                        if (shift === thatShift) {
                            count++;
                        }
                    };
                    break;
            }
            return count;
        }
        let isConflictWithPreferredShift = (preferredShift, thatShift) => {
            let result = false;
            if ((preferredShift === undefined) || (preferredShift === "") || (preferredShift === thatShift)) {
                return result;
            } else {
                if (preferredShift.startsWith("n")) {
                    if (preferredShift.indexOf(thatShift) > -1)
                        result = true;
                }
                else {
                    switch (thatShift) {
                        case "O":
                        case "d":
                        case "d1":
                        case "d2":
                        case "d3":
                            break;
                        default:
                            result = true;
                            break;
                    }
                }
            }
            return result;
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
        let isThatShiftOkForAssign = (preferredShift, previousShiftList, rosterList, shiftList, systemParam, thatShift) => {
            let temp = getNoOfConsecutiveWorkingDay(previousShiftList, thatShift);
            if (temp >= systemParam.maxConsecutiveWorkingDay) {
                console.log(thatShift + " form  consective working day=" + temp);
                return false;
            }
            if (isThatShiftFormBlackListedShiftPattern(rosterList, previousShiftList, thatShift)) {
                console.log(thatShift + " form black listed shift pattern");
                return false;
            }
            if (getTotalNoOfThatShiftAssigned(shiftList, thatShift) > systemParam.maxNoOfShiftPerMonth) {
                console.log(thatShift + " reach the maximum no. shift assignment");
                return false;
            }
            if (isConflictWithPreferredShift(preferredShift, thatShift)) {
                console.log(thatShift + " is conflict with preferred shift " + preferredShift);
                return false;
            }
            return true;
        }
        let getShuffledItoIdList = (itoIdList) => {
            return itoIdList.sort(() => Math.random() - 0.5);
        }
        let sortByVacantShiftCount = (a, b) => {
            let comparison = 0;
            if (a.vacantShiftCount > b.vacantShiftCount) {
                comparison = 1;
            } else {
                if (b.vacantShiftCount > a.vacantShiftCount) {
                    comparison = -1;
                }
            }
            return comparison;
        }
    }
}