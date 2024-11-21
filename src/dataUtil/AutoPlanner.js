import Utility from "../util/Utility";
export default class AutoPlanner {
    #essentialShift;
    #itoBlackListShiftPattern;
    #itoIdList;
    #noOfWorkingDay;
    #preferredShiftList;
    #previousMonthShiftList;
    #roster;
    #systemParam;
    constructor(startDate, endDate) {
        this.endDate = endDate;
        this.startDate = startDate;
    }
    setRosterSchedulerData = (rosterSchedulerData) => {
        this.#essentialShift = rosterSchedulerData.essentialShift;
        this.#itoBlackListShiftPattern = structuredClone(rosterSchedulerData.itoBlackListShiftPattern);
        this.#itoIdList = structuredClone(rosterSchedulerData.itoIdList);
        this.#noOfWorkingDay = rosterSchedulerData.noOfWorkingDay;
        this.#preferredShiftList = structuredClone(rosterSchedulerData.preferredShiftList);
        this.#previousMonthShiftList = structuredClone(rosterSchedulerData.previousMonthShiftList);
        this.#roster = structuredClone(rosterSchedulerData.roster);
        this.#systemParam = structuredClone(rosterSchedulerData.systemParam);
    }
    start = () => {
        return this.#doAutoPlan();
    }
    //======================================================================================================    
    #assignShift = (assignedShift, dateOfMonth, finalResult, itoId, shift) => {
        let isAssigned = false;
        if ((assignedShift.indexOf(shift) === -1) &&
            (this.#isAssignable(itoId, dateOfMonth, finalResult[itoId], shift))) {
            finalResult[itoId].shiftList[dateOfMonth] = shift;
            assignedShift += shift;
            isAssigned = true;
        }
        return isAssigned
    }
    #assignPreferredShift = (assignedShift, dateOfMonth, finalResult, itoId, preferredShiftList) => {
        let isAssigned = false;
        for (let q = 0; q < preferredShiftList.length; q++) {
            let preferredShift = preferredShiftList[q];
            switch (preferredShift) {
                case "d":
                case "d1":
                case "d2":
                case "d3":
                case "O":
                    finalResult[itoId].shiftList[dateOfMonth] = preferredShift;
                    isAssigned = true;
                    break;
                default:
                    isAssigned = this.#assignShift(assignedShift, dateOfMonth, finalResult, itoId, preferredShift);
                    break;
            }
            if (isAssigned) {
                break
            }
        }
        if (!isAssigned) {
            this.#handleUnAssigned(itoId, dateOfMonth, finalResult);
        }
        //return isAssigned
    }
    #assignNonPreferredShift = (assignedShift, dateOfMonth, finalResult, notAssignedITOIdList) => {
        for (let i = 0; i < notAssignedITOIdList.length; i++) {
            let itoId = notAssignedITOIdList[i];
            let isAssigned = false;
            for (let j = 0; j < this.#essentialShift.length; j++) {
                let shiftType = this.#essentialShift[j];
                if (this.#assignShift(assignedShift, dateOfMonth, finalResult, itoId, shiftType)) {
                    isAssigned = true;
                    break;
                }
            }
            if (!isAssigned) {
                this.#handleUnAssigned(itoId, dateOfMonth, finalResult);
            }
        }
    }
    #buildITOAvailableShift = itoId => {
        let result = {};
        if (this.#preferredShiftList[itoId]) {
            Object.keys(this.#preferredShiftList[itoId]).forEach(dateOfMonth => {
                //console.log(itoId, this.#preferredShiftList[itoId][dateOfMonth]);
                let temp = this.#preferredShiftList[itoId][dateOfMonth];
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
                let shiftObj = itoRoster.shiftList[j];
                if ((this.#essentialShift.indexOf(shiftObj) > -1) ||
                    (shiftObj === "O")
                ) {
                    preShift.push(shiftObj);
                }
            }
        }
        preShift = preShift.join(",");
        return preShift
    }
    #buildTempResult = itoId => {
        let item, preIndex;
        let result = {};
        let lastIndex = this.startDate - this.#systemParam.noOfPrevDate;
        for (let i = lastIndex; i < this.startDate; i++) {
            if (i < 1) {
                preIndex = i + Object.keys(this.#previousMonthShiftList[itoId]).length - 1;
                item = this.#previousMonthShiftList[itoId][preIndex];
            } else {
                item = this.#roster[itoId].shiftList[i];
            }
            result[i] = item;
        }
        return result;
    }
    #doAutoPlan = () => {
        let assignedShift = "";
        let finalResult = {};
        let previousMonthShiftCount = (this.#systemParam.noOfPrevDate - this.startDate) + 1;
        let itoAvailableShiftList = {};
        let isAssigned = false, notAssignedITOIdList;
        this.#itoIdList.forEach(itoId => {
            finalResult[itoId] = {
                availableShiftList: this.#roster[itoId].availableShiftList,
                workingHourPerDay: this.#roster[itoId].workingHourPerDay,
                shiftList: this.#buildTempResult(itoId, previousMonthShiftCount)
            }
            itoAvailableShiftList[itoId] = this.#buildITOAvailableShift(itoId);
            //console.log(itoId,finalResult[itoId].shiftList);
        });
        for (let dateOfMonth = this.startDate; dateOfMonth <= this.endDate; dateOfMonth++) {
            assignedShift = "";
            notAssignedITOIdList = [];
            let shuffledITOIdList = structuredClone(this.#itoIdList);
            Utility.shuffleArray(shuffledITOIdList);
            for (let i = 0; i < shuffledITOIdList.length; i++) {
                let itoId = shuffledITOIdList[i];
                let preferredShiftList = itoAvailableShiftList[itoId][dateOfMonth];
                //console.log("itoId=" + itoId + ",dateOfMonth=" + dateOfMonth + ",preferredShiftList=" + preferredShiftList);
                if (preferredShiftList) {
                    this.#assignPreferredShift(assignedShift, dateOfMonth, finalResult, itoId, preferredShiftList);
                } else {
                    notAssignedITOIdList.push(itoId);
                }
            }
            this.#assignNonPreferredShift(assignedShift, dateOfMonth, finalResult, notAssignedITOIdList);            
        }
        for (const [itoId, rosterObj] of Object.entries(finalResult)) {
            let dateList = Object.keys(rosterObj.shiftList);
            dateList.sort((a, b) => {
                let result;
                switch (true) {
                    case (Number(a) > Number(b)):
                        result = 1;
                        break;
                    case (Number(a) < Number(b)):
                        result = -1;
                        break;
                    default:
                        result = 0;
                        break
                }
                return result;
            });
            for (let i = 0; i < this.#systemParam.noOfPrevDate; i++) {
                delete finalResult[itoId].shiftList[dateList[i]];
            }
        }
        let temp = Utility.getAllITOStat(this.#essentialShift, this.startDate, this.endDate, this.#itoIdList, finalResult);
        finalResult.duplicateShiftList = temp.duplicateShiftList;
        finalResult.vacantShiftList = temp.vacantShiftList;
        return finalResult;
    }
    #getNoOfWorkingDay = (dateOfMonth, shiftList) => {
        let count = 0;
        for (let i = this.startDate; i < dateOfMonth; i++) {
            if (shiftList[i]) {
                let shiftObj = shiftList[i];
                if (this.#essentialShift.indexOf(shiftObj) > -1) {
                    count++
                }
            }
        }
        return count
    }
    #handleUnAssigned = (itoId, dateOfMonth, finalResult) => {
        let rosterObj = this.#roster[itoId];
        let shiftType = "";
        if (rosterObj.dutyPattern === "operator") {
            shiftType = "O";
        }
        finalResult[itoId].shiftList[dateOfMonth] = shiftType;
    }

    #isAssignable = (itoId, dateOfMonth, itoRoster, targetShift) => {
        let preShift, temp;
        let result = false;
        let rosterObj = this.#roster[itoId];
        //console.log("itoId=" + itoId + ",dateOfMonth=" + dateOfMonth + ",isUnderMaxConsecutiveWorkingDay=" + this.#isUnderMaxConsecutiveWorkingDay(itoRoster.shiftList, dateOfMonth) + ",noOfWorkingDay=" + this.#getNoOfWorkingDay(dateOfMonth, itoRoster.shiftList));
        if (rosterObj.dutyPattern === "operator") {
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
                    switch (shiftList[i]) {
                        case "d":
                        case "d1":
                        case "d2":
                        case "d3":
                        case "O":
                            count--;
                            break;
                        default:
                            if (this.#essentialShift.indexOf(shiftList[i]) > -1) {
                                count++
                            }
                            break;
                    }
                }
            }
            result = (count < this.#systemParam.maxConsecutiveWorkingDay);
        }
        return result;
    }
}