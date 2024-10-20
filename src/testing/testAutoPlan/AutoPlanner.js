import Utility from "../../util/Utility";
export default class AutoPlan {
    #endDate;
    #essentialShift;
    #itoBlackListShiftPattern;
    #iterationCount;
    #itoIdList;
    #preferredShiftList;
    #previousMonthShiftList;
    #roster;
    #startDate;
    #systemParam;
    constructor({
        endDate,
        essentialShift,
        itoBlackListShiftPattern,
        itoIdList,
        iterationCount,
        preferredShiftList,
        previousMonthShiftList,
        roster,
        startDate,
        systemParam,
    }) {
        this.#endDate = endDate;
        this.#essentialShift = essentialShift;
        this.#iterationCount = iterationCount;
        this.#itoBlackListShiftPattern = itoBlackListShiftPattern;
        this.#itoIdList = itoIdList;
        this.#preferredShiftList = preferredShiftList;
        this.#previousMonthShiftList = previousMonthShiftList;
        this.#roster = roster;
        this.#startDate = startDate;
        this.#systemParam = systemParam;
    }
    doAutoPlan() {
        let assignedShift = "";
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
            //for (let i = 0; i < shuffledITOId.length; i++) {
            //    itoId = shuffledITOId[i];
                itoId="ITO6_1999-01-01";
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
            //}
        }
        console.log(assignedShift, tempResult);
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
                    result.push({ "shiftType": this.#roster[itoId].shiftList[i][0].shiftType })
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
        console.log(lastIndex,tempResult.length);
        if (lastIndex > -1) {
            for (let i = tempResult.length - 1; i >= lastIndex; i--) {
                shift = tempResult[i];
                if (this.#essentialShift.indexOf(shift.shiftType) > -1) {
                    count++;
                }
            }
            console.log(count,this.#systemParam.maxConsecutiveWorkingDay);
            result = (count < this.#systemParam.maxConsecutiveWorkingDay);
            console.log(result);
        } else {
            result = true;
        }
        return result;
    }
}