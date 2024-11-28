import Utility from "../../util/Utility";
export default class AutoPlan {
    #activeShiftList;
    #endDate;
    #essentialShift;
    #itoBlackListShiftPattern;
    #iterationCount;
    #itoIdList;
    #noOfWorkingDay;
    #preferredShiftList;
    #previousMonthShiftList;
    #roster;
    #startDate;
    #systemParam;
    constructor({
        activeShiftList,
        endDate,
        essentialShift,
        itoBlackListShiftPattern,
        itoIdList,
        iterationCount,
        noOfWorkingDay,
        preferredShiftList,
        previousMonthShiftList,
        roster,
        startDate,
        systemParam,
    }) {
        this.#activeShiftList = activeShiftList;
        this.#endDate = endDate;
        this.#essentialShift = essentialShift;
        this.#iterationCount = iterationCount;
        this.#itoBlackListShiftPattern = itoBlackListShiftPattern;
        this.#itoIdList = itoIdList;
        this.#noOfWorkingDay = noOfWorkingDay;
        this.#preferredShiftList = preferredShiftList;
        this.#previousMonthShiftList = previousMonthShiftList;
        this.#roster = roster;
        this.#startDate = startDate;
        this.#systemParam = systemParam;
    }
    doAutoPlan() {
        let assignedShift = "";
        let finalResult = {};
        let tempResult = {};
        let previousMonthShiftCount = (this.#systemParam.noOfPrevDate - this.#startDate) + 1;
        let itoId, itoAvailableShift, itoAvailableShiftList = {};
        let isAssigned = false, preShift = [], temp;

        this.#itoIdList.forEach(itoId => {
            tempResult[itoId] = this.#buildTempResult(itoId, previousMonthShiftCount);
            //console.log(itoId, this.#buildTempResult(itoId, previousMonthShiftCount));
            if (this.#preferredShiftList[itoId]) {
                itoAvailableShiftList[itoId] = this.#buildITOAvailableShift(itoId);
            }
        });
        //console.log(itoAvailableShiftList["ITO6_1999-01-01"]);
        for (let dateOfMonth = this.#startDate; dateOfMonth <= this.#endDate; dateOfMonth++) {
            assignedShift = "";
            let shuffledITOId = structuredClone(this.#itoIdList);
            Utility.shuffleArray(shuffledITOId);
            for (let i = 0; i < shuffledITOId.length; i++) {
                itoId = shuffledITOId[i];
                //itoId="ITO1_1999-01-01";
                isAssigned = false; preShift = [];
                //console.log(itoId);
                if (this.#isUnderMaxConsecutiveWorkingDay(tempResult[itoId])) {
                    for (let j = tempResult[itoId].length - this.#systemParam.noOfPrevDate; j < tempResult[itoId].length; j++) {
                        preShift.push(tempResult[itoId][j].shiftType);
                    }
                    preShift = preShift.join(",");
                    itoAvailableShift = itoAvailableShiftList[itoId];
                    if (itoAvailableShift[dateOfMonth]) {
                        for (let i = 0; i < itoAvailableShift[dateOfMonth].length; i++) {
                            let preferredShift = itoAvailableShift[dateOfMonth][i];
                            temp = preShift + "," + preferredShift;
                            if (!this.#isBlackListShift(itoId, temp)) {
                                tempResult[itoId].push({ "shiftType": preferredShift });
                                assignedShift += preferredShift;
                                isAssigned = true;
                                break;
                            }
                        }
                    } else {
                        for (let i = 0; i < this.#essentialShift.length; i++) {
                            if (assignedShift.indexOf(this.#essentialShift[i]) === -1) {
                                temp = preShift + "," + this.#essentialShift[i];
                                if (!this.#isBlackListShift(itoId, temp)) {
                                    tempResult[itoId].push({ "shiftType": this.#essentialShift[i] });
                                    assignedShift += this.#essentialShift[i];
                                    isAssigned = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (!isAssigned) {
                    tempResult[itoId].push({ "shiftType": "" });
                }
            }
        }
        //console.log(tempResult["ITO6_1999-01-01"]);
        //console.log(tempResult);
        this.#itoIdList.forEach(itoId => {
            finalResult[itoId] = {
                availableShiftList: this.#roster[itoId].availableShiftList,
                workingHourPerDay: this.#roster[itoId].workingHourPerDay,
                shiftList: {}
            };
            for (let i = 2; i < tempResult[itoId].length; i++) {
                finalResult[itoId].shiftList[i - 2 + this.#startDate] = [tempResult[itoId][i]];
            }
        });
        finalResult = Utility.genITOStat(this.#activeShiftList, finalResult, this.#noOfWorkingDay);
        temp = Utility.getAllITOStat(this.#essentialShift, this.#startDate,this.#endDate , this.#itoIdList, finalResult);
        finalResult.duplicateShiftList = structuredClone(temp.duplicateShiftList);
        finalResult.vacantShiftList = structuredClone(temp.vacantShiftList);
        return finalResult;
    }
    //======================================================================================
    #buildITOAvailableShift = itoId => {
        let result = {};
        Object.keys(this.#preferredShiftList[itoId]).forEach(dateOfMonth => {
            let temp = this.#preferredShiftList[itoId][dateOfMonth][0].shiftType;
            temp = temp.trim();
            result[dateOfMonth] = [];
            if (temp.startsWith("n")) {
                result[dateOfMonth] = this.#roster[itoId].availableShiftList.filter(shift => {
                    let bResult = true
                    for (let j = 1; j < temp.length; j++) {
                        if ((shift === temp[j]) || (this.#essentialShift.indexOf(shift) === -1)) {
                            bResult = false;
                        }
                    }
                    return bResult;
                });
            } else {
                result[dateOfMonth] = this.#roster[itoId].availableShiftList.filter(shift => {
                    let aResult = false;
                    switch (true) {
                        case (shift === temp):
                            aResult = true;
                            break;
                        case ((shift === "b") && (temp.startsWith("b"))):
                            aResult = true;
                            break;
                        case ((shift === "d1") && (temp === "al")):
                            aResult = true;
                            break;
                        case ((shift === "O") && (temp === "o")):
                            aResult = true;
                            break;
                        default:
                            break;
                    }
                    return aResult;
                });
            }
        });
        return result;
    }
    #buildTempResult = (itoId, previousMonthShiftCount) => {
        let result = [];
        let startIndex, temp;
        if (previousMonthShiftCount > 0) {
            if (this.#previousMonthShiftList[itoId]) {
                startIndex = Object.keys(this.#previousMonthShiftList[itoId]).length - previousMonthShiftCount;
                for (let i = startIndex; i < Object.keys(this.#previousMonthShiftList[itoId]).length; i++) {
                    result.push({
                        "shiftType": this.#previousMonthShiftList[itoId][i].shiftType
                    });
                }
            } else {
                for (let i = 0; i < previousMonthShiftCount; i++) {
                    result.push({ "shiftType": "" });
                }
            }
        }
        temp = this.#systemParam.noOfPrevDate - result.length;
        if (temp > 0) {
            for (let i = this.#startDate - temp; i < this.#startDate; i++) {
                if (this.#roster[itoId].shiftList[i]) {
                    let isAssigned = false;
                    for (let j = 0; j < this.#roster[itoId].shiftList[i].length; j++) {
                        //console.log(itoId, this.#roster[itoId].shiftList[i][j].shiftType, this.#essentialShift.indexOf(this.#roster[itoId].shiftList[i][j].shiftType))
                        if (this.#essentialShift.indexOf(this.#roster[itoId].shiftList[i][j].shiftType) > -1) {
                            result.push({ "shiftType": this.#roster[itoId].shiftList[i][j].shiftType });
                            isAssigned = true;
                            break;
                        }
                    }
                    if (!isAssigned) {
                        result.push({ "shiftType": this.#roster[itoId].shiftList[i][0].shiftType })
                    }
                } else {
                    result.push({ "shiftType": "" });
                }
            }
        }
        return result;
    }
    #isBlackListShift = (itoId, newShift) => {
        let result = false;
        if (this.#itoBlackListShiftPattern[itoId]) {
            for (let i = 0; i < this.#itoBlackListShiftPattern[itoId].length; i++) {
                let blackListShift = this.#itoBlackListShiftPattern[itoId][i];
                //console.log(newShift, blackListShift, newShift.indexOf(blackListShift));
                if (newShift.indexOf(blackListShift) > -1) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
    #isUnderMaxConsecutiveWorkingDay = tempResult => {
        let count = 0;
        let lastIndex = tempResult.length - this.#systemParam.maxConsecutiveWorkingDay;
        let result = false;
        let shift;
        //lastIndex -= this.#systemParam.noOfPrevDate;
        //console.log(lastIndex,tempResult.length);
        if (lastIndex > -1) {
            for (let i = lastIndex; i < tempResult.length; i++) {
                shift = tempResult[i];
                switch (shift.shiftType) {
                    case "":
                    case "d":
                    case "d1":
                    case "d2":
                    case "d3":
                    case "O":
                        if (count > 0) {
                            count--;
                        }
                        break;
                    default:
                        count++;
                        break;
                }
            }
            //console.log(count,this.#systemParam.maxConsecutiveWorkingDay);
            result = (count < this.#systemParam.maxConsecutiveWorkingDay);
            //console.log(result);
        } else {
            result = true;
        }
        return result;
    }
}