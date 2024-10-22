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
        let previousMonthShiftCount = (this.#systemParam.noOfPrevDate - this.#startDate) + 1;
        let itoId, itoAvailableShift, itoAvailableShiftList = {};
        let isAssigned = false, preShift, temp;
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
            let shuffledITOId = structuredClone(this.#itoIdList);
            assignedShift = "";
            for (let i = 0; i < shuffledITOId.length; i++) {
                //itoId="ITO1_1999-01-01";
                itoId = shuffledITOId[i];
                if (this.#isUnderMaxConsecutiveWorkingDay(finalResult[itoId].shiftList, dateOfMonth)) {
                    preShift = this.#buildPreShift(itoId, dateOfMonth, finalResult);
                    itoAvailableShift = itoAvailableShiftList[itoId];
                    if (itoAvailableShift[dateOfMonth]) {
                        for (let k = 0; k < itoAvailableShift[dateOfMonth].length; k++) {
                            let preferredShift = itoAvailableShift[dateOfMonth][k];
                            if (assignedShift.indexOf(preferredShift) === -1){
                                temp = preShift + "," + preferredShift;
                                if (!this.#isBlackListShift(itoId, temp)) {
                                    assignedShift += preferredShift;
                                    finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": preferredShift }];
                                    break;
                                }    
                            }
                        }
                    }
                }else{
                    finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": "O" }];
                }
            }
            for (let i = 0; i < shuffledITOId.length; i++) {
                itoId = shuffledITOId[i];
                if (finalResult[itoId].shiftList[dateOfMonth] === undefined){
                    if (this.#isUnderMaxConsecutiveWorkingDay(finalResult[itoId].shiftList, dateOfMonth)) {
                        preShift = this.#buildPreShift(itoId, dateOfMonth, finalResult);
                        isAssigned = false;
                        for (let k = 0; k < this.#essentialShift.length; k++) {
                            if (assignedShift.indexOf(this.#essentialShift[k]) === -1) {
                                temp = preShift + "," +this.#essentialShift[k];
                                if (!this.#isBlackListShift(itoId, temp)) {
                                    assignedShift +=this.#essentialShift[k];
                                    finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": this.#essentialShift[k] }];
                                    isAssigned = true;
                                    break;
                                }
                            }
                        }
                        if (!isAssigned){
                            finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": "O" }];    
                        }
                    }else{
                        finalResult[itoId].shiftList[dateOfMonth] = [{ "shiftType": "O" }];
                    }
                }
            }
        }
        //console.log(finalResult);
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
    #buildPreShift = (itoId, dateOfMonth, itoRoster) => {
        let preShift = [];
        for (let j = dateOfMonth - this.#systemParam.noOfPrevDate; j < dateOfMonth; j++) {
            itoRoster[itoId].shiftList[j].forEach(shiftObj => {
                if ((this.#essentialShift.indexOf(shiftObj.shiftType) > -1) ||
                        (shiftObj.shiftType ==="O")
                    ) {
                    preShift.push(shiftObj.shiftType);
                }
            });
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
    #isUnderMaxConsecutiveWorkingDay = (itoRoster, dateOfMonth) => {
        let count = 0;
        let result = true;
        let firstIndex = dateOfMonth - this.#systemParam.maxConsecutiveWorkingDay;
        if (itoRoster[firstIndex]) {
            for (let i = firstIndex; i < dateOfMonth; i++) {
                console.log(firstIndex, itoRoster[i]);
            }
        }
        return result;
    }
}