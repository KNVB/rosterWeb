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
    start() {
        let assignedShift = "";
        let finalResult = {};
        let previousMonthShiftCount = (this.#systemParam.noOfPrevDate - this.#startDate) + 1;
        let itoAvailableShiftList = {};
        let isAssigned = false, notAssignedITOIdList;
        this.#itoIdList.forEach(itoId => {
            finalResult[itoId] = {
                availableShiftList: this.#roster[itoId].availableShiftList,
                workingHourPerDay: this.#roster[itoId].workingHourPerDay,
                shiftList: this.#buildTempResult(itoId, previousMonthShiftCount)
            }
            if (this.#preferredShiftList[itoId]) {
                itoAvailableShiftList[itoId] = this.#buildITOAvailableShift(itoId);
            }
        });

        //let dateOfMonth = this.#startDate;
        for (let dateOfMonth = this.#startDate; dateOfMonth <= this.#endDate; dateOfMonth++) {
            notAssignedITOIdList = [];
            let shuffledITOIdList = structuredClone(this.#itoIdList);
            assignedShift = "";
            for (let i = 0; i < shuffledITOIdList.length; i++) {
                let itoId = shuffledITOIdList[i];
                isAssigned = false;
                if (this.#isUnderMaxConsecutiveWorkingDay(finalResult[itoId].shiftList, dateOfMonth)) {
                    let preferredShiftList = itoAvailableShiftList[itoId][dateOfMonth];
                    if (preferredShiftList) {
                        preferredShiftList.forEach(preferredShift => {
                            switch (preferredShift) {
                                case "d":
                                case "d1":
                                case "d2":
                                case "d3":
                                case "O":
                                    finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": preferredShift }];
                                    isAssigned = true;
                                    break;
                                default:
                                    if ((assignedShift.indexOf(preferredShift) === -1) &&
                                        (this.#isAssignable(itoId, dateOfMonth, finalResult[itoId], preferredShift))) {
                                        finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": preferredShift }];
                                        console.log(itoId,dateOfMonth,preferredShift);
                                        assignedShift += preferredShift;
                                        isAssigned = true;
                                    }
                                    break

                            }
                        });
                    }
                } else {
                    finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": "O" }];
                    isAssigned = true;
                }
                if (!isAssigned) {
                    notAssignedITOIdList.push(itoId);
                }
            }
            for (let k = 0; k < notAssignedITOIdList.length; k++) {
                let itoId = notAssignedITOIdList[k];
                isAssigned = false;
              
                for (let j = 0; j < this.#essentialShift.length; j++) {
                    if ((dateOfMonth === 13) && (itoId === "ITO8_1999-01-01")) {
                        console.log(assignedShift,(this.#isAssignable(itoId, dateOfMonth, finalResult[itoId], this.#essentialShift[j])));
                    }
                    if ((assignedShift.indexOf(this.#essentialShift[j]) === -1) &&
                        (this.#isAssignable(itoId, dateOfMonth, finalResult[itoId], this.#essentialShift[j]))) {
                        finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": this.#essentialShift[j] }];
                        assignedShift += this.#essentialShift[j];
                        isAssigned = true;
                    }
                }
                if (!isAssigned) {
                    finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": "O" }];
                }
            };
        }
        console.log(finalResult);
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
    #buildPreShift = (itoRoster, dateOfMonth) => {
        let preShift = [];
        for (let j = dateOfMonth - this.#systemParam.noOfPrevDate; j < dateOfMonth; j++) {
            for (let k = 0; k < itoRoster.shiftList[j].length; k++) {
                let shiftObj = itoRoster.shiftList[j][k];
                if ((this.#essentialShift.indexOf(shiftObj.shiftType) > -1) ||
                    (shiftObj.shiftType === "O")
                ) {
                    preShift.push(shiftObj.shiftType);
                }
            }
        }
        preShift = preShift.join(",");
        return preShift
    }
    #buildTempResult = (itoId) => {
        let item, preIndex;
        let result = {};
        let lastIndex = this.#startDate - this.#systemParam.noOfPrevDate;
        for (let i = lastIndex; i < this.#startDate; i++) {
            if (i < 1) {
                preIndex = i + Object.keys(this.#previousMonthShiftList[itoId]).length - 1;
                item = [this.#previousMonthShiftList[itoId][preIndex]];
            } else {
                item = this.#roster[itoId].shiftList[i];
            }
            result[i] = item;
        }
        return result;
    }
    #isAssignable = (itoId, dateOfMonth, itoRoster, targetShift) => {
        let preShift, temp;
        let result = false;
        if (this.#essentialShift.indexOf(targetShift) > -1) {
            preShift = this.#buildPreShift(itoRoster, dateOfMonth);
            temp = preShift + "," + targetShift;
            if (!this.#isBlackListShift(itoId, temp)) {
                result = true;
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
    #isUnderMaxConsecutiveWorkingDay = (shiftList, dateOfMonth) => {
        let count = 0;
        let result = true;
        let firstIndex = dateOfMonth - this.#systemParam.maxConsecutiveWorkingDay;
        if (shiftList[firstIndex]) {
            for (let i = firstIndex; i < dateOfMonth; i++) {
                //console.log(firstIndex, shiftList[i]);
                if (shiftList[i]) {
                    for (let j = 0; j < shiftList[i].length; j++) {
                        switch (shiftList[i][j].shiftType) {
                            case "d":
                            case "d1":
                            case "d2":
                            case "d3":
                            case "O":
                                count--;
                                break;
                            default:
                                if (this.#essentialShift.indexOf(shiftList[i][j].shiftType) > -1) {
                                    count++
                                }
                                break;
                        }
                    }
                }
            }
            result = (count < this.#systemParam.maxConsecutiveWorkingDay);
        }
        return result;
    }
}