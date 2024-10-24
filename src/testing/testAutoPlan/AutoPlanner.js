import Utility from "../../util/Utility";
export default class AutoPlan {
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
    constructor(startDate, endDate, {
        essentialShift,
        itoBlackListShiftPattern,
        itoIdList,
        iterationCount,
        noOfWorkingDay,
        preferredShiftList,
        previousMonthShiftList,
        roster,
        systemParam,
    }) {
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
            itoAvailableShiftList[itoId] = this.#buildITOAvailableShift(itoId);
        });

        //let dateOfMonth = this.#startDate;
        for (let dateOfMonth = this.#startDate; dateOfMonth <= this.#endDate; dateOfMonth++) {
            assignedShift = "";
            notAssignedITOIdList = [];
            let shuffledITOIdList = structuredClone(this.#itoIdList);
            Utility.shuffleArray(shuffledITOIdList);
            for (let i = 0; i < shuffledITOIdList.length; i++) {
                let itoId = shuffledITOIdList[i];
                let preferredShiftList = itoAvailableShiftList[itoId][dateOfMonth];
                console.log("itoId=" + itoId + ",dateOfMonth=" + dateOfMonth + ",preferredShiftList=" + preferredShiftList);
                if (preferredShiftList) {
                    isAssigned = false;
                    for (let q = 0; q < preferredShiftList.length; q++) {
                        let preferredShift = preferredShiftList[q];
                        console.log("itoId=" + itoId + ",dateOfMonth=" + dateOfMonth + ",preferredShift=" + preferredShift + ",assignedShift=" + assignedShift + ",isAssignable=" + this.#isAssignable(itoId, dateOfMonth, finalResult[itoId], preferredShift));
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
                                    assignedShift += preferredShift;
                                    isAssigned = true;
                                }
                                break;
                        }
                        if (isAssigned) {
                            break
                        }
                    }
                    if (!isAssigned) {
                        finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": "O" }];
                    }
                } else {
                    notAssignedITOIdList.push(itoId);
                }
            }
            for (let i = 0; i < notAssignedITOIdList.length; i++) {
                let itoId = notAssignedITOIdList[i];
                isAssigned = false;
                for (let j = 0; j < this.#essentialShift.length; j++) {
                    let shiftType = this.#essentialShift[j];
                    if (assignedShift.indexOf(shiftType) === -1) {
                        if (this.#isAssignable(itoId, dateOfMonth, finalResult[itoId], shiftType)) {
                            finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": shiftType }];
                            assignedShift += shiftType;
                            isAssigned = true;
                            break;
                        }
                    }
                }
                if (!isAssigned) {
                    finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": "O" }];
                }
            }
            console.log("=======================================================");
        }
        //console.log(finalResult);
        let temp=Utility.getAllITOStat(this.#essentialShift, this.#startDate, this.#endDate, this.#itoIdList, finalResult);
        finalResult.duplicateShiftList=temp.duplicateShiftList;
        finalResult.vacantShiftList=temp.vacantShiftList;
        return finalResult;
    }
    //======================================================================================
    #buildITOAvailableShift = itoId => {
        let result = {};
        if (this.#preferredShiftList[itoId]) {
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
        }

        return result;
    }
    #buildPreShift = (itoRoster, dateOfMonth) => {
        let preShift = [];
        for (let j = dateOfMonth - this.#systemParam.noOfPrevDate; j < dateOfMonth; j++) {
            if (itoRoster.shiftList[j]) {
                for (let k = 0; k < itoRoster.shiftList[j].length; k++) {
                    let shiftObj = itoRoster.shiftList[j][k];
                    if ((this.#essentialShift.indexOf(shiftObj.shiftType) > -1) ||
                        (shiftObj.shiftType === "O")
                    ) {
                        preShift.push(shiftObj.shiftType);
                    }
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
    #getNoOfWorkingDay = (dateOfMonth, shiftList) => {
        let count = 0;
        for (let i = this.#startDate; i < dateOfMonth; i++) {
            if (shiftList) {
                shiftList[i].forEach(shiftObj => {
                    if (this.#essentialShift.indexOf(shiftObj.shiftType) > -1) {
                        count++
                    }
                });
            }
        }
        return count
    }
    #isAssignable = (itoId, dateOfMonth, itoRoster, targetShift) => {
        let preShift, temp;
        let result = false;
        console.log("itoId=" + itoId + ",dateOfMonth=" + dateOfMonth + ",isUnderMaxConsecutiveWorkingDay=" + this.#isUnderMaxConsecutiveWorkingDay(itoRoster.shiftList, dateOfMonth) + ",noOfWorkingDay=" + this.#getNoOfWorkingDay(dateOfMonth, itoRoster.shiftList));
        if (this.#getNoOfWorkingDay(dateOfMonth, itoRoster.shiftList) < this.#noOfWorkingDay) {
            if (this.#isUnderMaxConsecutiveWorkingDay(itoRoster.shiftList, dateOfMonth)) {
                if (this.#essentialShift.indexOf(targetShift) > -1) {
                    preShift = this.#buildPreShift(itoRoster, dateOfMonth);
                    temp = preShift + "," + targetShift;
                    if (!this.#isBlackListShift(itoId, temp)) {
                        result = true;
                    }
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