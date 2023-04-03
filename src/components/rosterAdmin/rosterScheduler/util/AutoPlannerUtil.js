import AdminShiftStatUtil from './AdminShiftStatUtil';
import ITOShiftStatUtil from "../../../../util/ITOShiftStatUtil";
export default class AutoPlannerUtil {
    constructor() {
        let iterationCount = 100;

        let startDate = 1, endDate;
        this.autoPlan = (noOfWorkingDay, rosterSchedulerDataUtil, systemParam) => {
            if (startDate > endDate) {
                throw new Error("Invalid start date or end date selection");
            } else {
                let finalResult = [], tempResult = [];
                for (let i = 0; i < iterationCount; i++) {
                    tempResult.push(this.genResult(noOfWorkingDay, rosterSchedulerDataUtil, systemParam));
                }
                tempResult.sort(sortByVacantShiftCount);
                let j = ((tempResult.length > 3) ? 3 : tempResult.length);
                for (let i = 0; i < j; i++) {
                    finalResult.push(tempResult[i]);
                }
                return finalResult;
            }
        }
        this.genResult = (noOfWorkingDay, rosterSchedulerDataUtil, systemParam) => {
            let activeShiftList = rosterSchedulerDataUtil.getActiveShiftList();
            let availableShiftList;
            let essentialShift = '';
            let itoIdList;
            let preferredShift, preferredShiftList, previousShiftList = {};
            let resultantRoster = {rosterRow:{}}, resultantShiftList, rosterSchedulerData = rosterSchedulerDataUtil.getRosterSchedulerData();
            let { getAllITOStat } = AdminShiftStatUtil();
            let { getITOStat } = ITOShiftStatUtil();
            //console.log(activeShiftList);
            //console.log(systemParam);
            preferredShiftList = rosterSchedulerData.preferredShiftList;
            for (let dateIndex = startDate; dateIndex <= endDate; dateIndex++) {
                essentialShift = activeShiftList.essentialShift;
                itoIdList = getShuffledItoIdList(rosterSchedulerDataUtil.getItoIdList());
                for (let i = 0; i < itoIdList.length; i++) {
                    if (resultantRoster.rosterRow[itoIdList[i]] === undefined) {
                        let roster = rosterSchedulerDataUtil.getRoster().rosterRow[itoIdList[i]];
                        resultantRoster.rosterRow[itoIdList[i]] = {
                            availableShiftList: roster.availableShiftList,
                            itoName: roster.itoName,
                            itoPostName: roster.itoPostName,
                            lastMonthBalance: roster.lastMonthBalance,
                            shiftList: {},
                            workingHourPerDay: roster.workingHourPerDay
                        };
                        resultantShiftList = {};
                    } else {
                        resultantShiftList = resultantRoster.rosterRow[itoIdList[i]].shiftList;
                    }
                    previousShiftList = rosterSchedulerData.previousMonthShiftList[itoIdList[i]];
                    if (preferredShiftList[itoIdList[i]] === undefined) {
                        preferredShiftList[itoIdList[i]] = {};
                        preferredShift = "";
                    } else {
                        preferredShift = preferredShiftList[itoIdList[i]][dateIndex];
                    }
                    switch (preferredShift) {
                        case "o":
                            resultantShiftList[dateIndex] = "O";
                            previousShiftList.shift();
                            previousShiftList.push("O");
                            break;
                        case "d":
                        case "d1":
                        case "d2":
                        case "d3":
                            resultantShiftList[dateIndex] = preferredShift;
                            previousShiftList.shift();
                            previousShiftList.push(preferredShift);
                            break;
                        default:
                            availableShiftList = getAvailableShift(itoIdList[i], preferredShift, previousShiftList, rosterSchedulerDataUtil, resultantShiftList, systemParam);
                            if ((essentialShift === '') || (availableShiftList.length === 0)) {
                                resultantShiftList[dateIndex] = "O";
                                if (previousShiftList === undefined) {
                                    previousShiftList = ["O"];
                                } else {
                                    previousShiftList.shift();
                                    previousShiftList.push("O");
                                }
                            } else {
                                let isAssigned = false, comparator;
                                for (let j = 0; j < availableShiftList.length; j++) {
                                    if (availableShiftList[j] === "b1") {
                                        comparator = "b";
                                    } else {
                                        comparator = availableShiftList[j];
                                    }
                                    if (essentialShift.indexOf(comparator) > -1) {
                                        essentialShift = essentialShift.replace(comparator, "");
                                        resultantShiftList[dateIndex] = availableShiftList[j];
                                        if (previousShiftList === undefined) {
                                            previousShiftList = [availableShiftList[j]];
                                        } else {
                                            previousShiftList.shift();
                                            previousShiftList.push(availableShiftList[j]);
                                        }
                                        isAssigned = true;
                                        break;
                                    }
                                }
                                if (!isAssigned) {
                                    //	console.log(" O shift is assigned on day "+dateIndex);
                                    resultantShiftList[dateIndex] = "O";
                                    if (previousShiftList === undefined) {
                                        previousShiftList = ["O"];
                                    } else {
                                        previousShiftList.shift();
                                        previousShiftList.push("O");
                                    }
                                }
                            }
                            break;
                    }
                    resultantRoster.rosterRow[itoIdList[i]].shiftList = resultantShiftList;
                    //console.log("itoId=" + itoId + ",resultantShiftList=" + resultantShiftList);
                    //console.log("====================");    
                }
            }
            itoIdList = rosterSchedulerDataUtil.getItoIdList();
            itoIdList.forEach(itoId => {
                let rosterInfo = getITOStat(activeShiftList, noOfWorkingDay, resultantRoster.rosterRow[itoId]);
                resultantRoster.rosterRow[itoId] = { ...rosterInfo };
            });
            let temp = getAllITOStat(activeShiftList, startDate, endDate, resultantRoster.rosterRow);
            resultantRoster.duplicateShiftList = temp.duplicateShiftList;
            resultantRoster.vacantShiftList = temp.vacantShiftList;
            return resultantRoster;
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
        let getAvailableShift = (itoId, preferredShift, previousShiftList, rosterSchedulerDataUtil, resultantShiftList, systemParam) => {
            let availableShiftList = rosterSchedulerDataUtil.getRoster().rosterRow[itoId].availableShiftList;
            let result = [];
            availableShiftList.forEach(shift => {
                if (isThatShiftOkForAssign(itoId, previousShiftList, preferredShift, resultantShiftList, rosterSchedulerDataUtil.getRosterSchedulerData(), shift, systemParam)) {
                    result.push(shift);
                }
            });
            return result;
        };
        let getNoOfConsecutiveWorkingDay = (previousShiftList, thatShift) => {
            let count = 0;
            if (previousShiftList !== undefined) {
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
            }
            return count;
        }
        let getTotalNoOfThatShiftAssigned = (resultantShiftList, thatShift) => {
            let count = 0;
            for (let [, shift] of Object.entries(resultantShiftList)) {
                if (shift === thatShift)
                    count++;
            };
            return count;
        }
        let getShuffledItoIdList = (itoIdList) => {
            return itoIdList.sort(() => Math.random() - 0.5);
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
        }
        let isThatShiftFormBlackListedShiftPattern = (itoId, previousShiftList, rosterSchedulerData, thatShift) => {
            let shiftPattern = [];
            let result = false;
            if (previousShiftList !== undefined) {
                previousShiftList.forEach(shift => {
                    if (shift) {
                        shiftPattern.push(shift);
                    }
                });
                shiftPattern.push(thatShift);
                shiftPattern = shiftPattern.join(",");
                let blackListShiftPatternList = rosterSchedulerData.blackListShiftPattern[itoId];
                blackListShiftPatternList.forEach(blackListShift => {
                    if (shiftPattern.indexOf(blackListShift) > -1) {
                        result = true;
                        return result;
                    }
                });
            }
            return result;
        }
        let isThatShiftOkForAssign = (itoId, previousShiftList, preferredShift, resultantShiftList, rosterSchedulerData, thatShift, systemParam) => {
            let result = true;
            let totalNoOfThatShiftAssigned = getTotalNoOfThatShiftAssigned(resultantShiftList, thatShift);
            let noOfConsecutiveWorkingDay = getNoOfConsecutiveWorkingDay(previousShiftList, thatShift);

            if (totalNoOfThatShiftAssigned > systemParam.maxNoOfShiftPerMonth) {
                return false;
            }
            if (noOfConsecutiveWorkingDay >= systemParam.maxConsecutiveWorkingDay) {
                //console.log(ito.itoId+","+dateIndex+","+thatShift+", cause over the max. consecutive working day");
                return false;
            }
            if (isThatShiftFormBlackListedShiftPattern(itoId, previousShiftList, rosterSchedulerData, thatShift)) {
                //console.log(ito.itoId+","+dateIndex+","+thatShift+", form black list");
                return false;
            }
            if (isConflictWithPreferredShift(preferredShift, thatShift)) {
                //console.log(ito.itoId+","+dateIndex+","+thatShift+",conflict with preferred("+preferredShift+").");
                return false;
            }
            return result;
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