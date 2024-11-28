import Utility from "../util/Utility";
export default class AutoPlanner {
    #activeShiftList;
    #calendarDateList;
    #essentialShift;
    #essentialShiftList;
    #itoBlackListShiftPattern;
    #itoIdList;
    #nonStandardWorkingHourSummary;
    #noOfWorkingDay;
    #preferredShiftList;
    #previousMonthShiftList;
    #roster;
    #rosterMonth;
    #systemParam;
    constructor(startDate, endDate) {
        this.endDate = endDate;
        this.startDate = startDate;
    }
    setRosterSchedulerData = (rosterSchedulerData) => {
        this.#activeShiftList = structuredClone(rosterSchedulerData.activeShiftList);
        this.#calendarDateList = structuredClone(rosterSchedulerData.calendarDateList);
        this.#essentialShift = rosterSchedulerData.essentialShift;
        this.#itoBlackListShiftPattern = structuredClone(rosterSchedulerData.itoBlackListShiftPattern);
        this.#itoIdList = structuredClone(rosterSchedulerData.itoIdList);
        this.#nonStandardWorkingHourSummary = structuredClone(rosterSchedulerData.nonStandardWorkingHourSummary);
        this.#noOfWorkingDay = rosterSchedulerData.noOfWorkingDay;
        this.#preferredShiftList = structuredClone(rosterSchedulerData.preferredShiftList);
        this.#previousMonthShiftList = structuredClone(rosterSchedulerData.previousMonthShiftList);
        this.#roster = structuredClone(rosterSchedulerData.roster);
        this.#rosterMonth = structuredClone(rosterSchedulerData.rosterMonth);
        this.#systemParam = structuredClone(rosterSchedulerData.systemParam);

        this.#essentialShiftList = [];
        for (let i = 0; i < this.#essentialShift.length; i++) {
            this.#essentialShiftList.push(this.#essentialShift[i]);
        }
    }
    start = () => {
        let finalResult = structuredClone(this.#roster);
        let planResult = this.#doAutoPlan();
        Object.keys(planResult).forEach(itoId => {
            let shiftList = planResult[itoId].shiftList;
            Object.keys(shiftList).forEach(dateOfMonth => {
                finalResult[itoId].shiftList[dateOfMonth] = shiftList[dateOfMonth];
            });
        });
        //finalResult = Utility.genITOStat(this.#activeShiftList, this.#noOfWorkingDay, finalResult, this.#nonStandardWorkingHourSummary);
        Utility.updateITOStat(this.#activeShiftList, finalResult, this.#nonStandardWorkingHourSummary);
        let tempResult = Utility.getAllITOStat(this.#essentialShift, 1, this.#calendarDateList.length, this.#itoIdList, finalResult);
        //console.log(tempResult);
        return {
            duplicateShiftList: structuredClone(tempResult.duplicateShiftList),
            roster: finalResult,
            vacantShiftList: structuredClone(tempResult.vacantShiftList)
        };
    }
    //======================================================================================================    
    #buildITOAvailableShift = itoId => {
        let result = {};
        let itoRoster = this.#roster[itoId];
        for (let dateOfMonth = this.startDate; dateOfMonth <= this.endDate; dateOfMonth++) {
            let theDate=new Date(this.#rosterMonth.getFullYear(),this.#rosterMonth.getMonth(),dateOfMonth);
            if (theDate < itoRoster.joinDate){
                result[dateOfMonth] = "o"
            }else{
                if (this.#preferredShiftList[itoId][dateOfMonth]) {
                    result[dateOfMonth] = this.#processPreferredShiftList(itoId, dateOfMonth);    
                }else {
                    result[dateOfMonth] = structuredClone(this.#essentialShiftList);     
                }
            }
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
        let isAssigned = false;
        //console.log(this.#preferredShiftList["ITO4_1999-01-01"]);
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
            let shuffledITOIdList = structuredClone(this.#itoIdList);
            Utility.shuffleArray(shuffledITOIdList);
            isAssigned = false;
            for (let i = 0; i < shuffledITOIdList.length; i++) {
                let itoId = shuffledITOIdList[i];
                let itoAvailableShift = itoAvailableShiftList[itoId][dateOfMonth];
                isAssigned = false;
                for (let j = 0; j < itoAvailableShift.length; j++) {
                    let shift = itoAvailableShift[j];
                    if (this.#isAssignable(assignedShift, dateOfMonth, itoId, finalResult[itoId], shift)) {
                        finalResult[itoId].shiftList[dateOfMonth] = shift;
                        assignedShift += shift;
                        isAssigned = true;
                        break;
                    }
                }
                if (!isAssigned) {
                    finalResult[itoId].shiftList[dateOfMonth] = "";
                }
            }
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
    #isAssignable = (assignedShift, dateOfMonth, itoId, itoRoster, targetShift) => {
        let preShift, temp;
        let result = false;
        let rosterObj = this.#roster[itoId];
        //console.log("itoId=" + itoId + ",dateOfMonth=" + dateOfMonth + ",isUnderMaxConsecutiveWorkingDay=" + this.#isUnderMaxConsecutiveWorkingDay(itoRoster.shiftList, dateOfMonth) + ",noOfWorkingDay=" + this.#getNoOfWorkingDay(dateOfMonth, itoRoster.shiftList));
        if (rosterObj.dutyPattern === "operator") {
            if (assignedShift.indexOf(targetShift) === -1) {
                /*
                if (itoId === "ITO4_1999-01-01") {
                    console.log(itoId,dateOfMonth, assignedShift, itoRoster, 
                        this.#getNoOfWorkingDay(dateOfMonth, itoRoster.shiftList), 
                        this.#isUnderMaxConsecutiveWorkingDay(dateOfMonth, itoRoster.shiftList, itoId));
                }*/
                if (this.#getNoOfWorkingDay(dateOfMonth, itoRoster.shiftList) < this.#noOfWorkingDay) {
                    if (this.#isUnderMaxConsecutiveWorkingDay(dateOfMonth, itoRoster.shiftList, itoId)) {
                        switch (targetShift) {
                            case "d":
                            case "d1":
                            case "d2":
                            case "d3":
                            case "O":
                                result = true;
                                break;
                            default:
                                if (this.#essentialShift.indexOf(targetShift) > -1) {
                                    preShift = this.#buildPreShift(itoRoster, dateOfMonth);
                                    temp = preShift + "," + targetShift;
                                    if (!this.#isBlackListShift(itoId, temp)) {
                                        result = true;
                                    }
                                }
                                break;
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

                if (newShift.indexOf(blackListShift) > -1) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
    #isUnderMaxConsecutiveWorkingDay = (dateOfMonth, shiftList, itoId) => {
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
    #processPreferredShiftList = (itoId, dateOfMonth) => {
        let result = [];
        let temp = this.#preferredShiftList[itoId][dateOfMonth];
        temp = temp.trim();
        if (temp.startsWith("n")) {
            result = this.#roster[itoId].availableShiftList.filter(shift => {
                let bResult = true
                for (let j = 1; j < temp.length; j++) {
                    if ((shift === temp[j]) || (this.#essentialShift.indexOf(shift) === -1)) {
                        bResult = false;
                    }
                }
                return bResult;
            });
        } else {
            result = this.#roster[itoId].availableShiftList.filter(shift => {
                let aResult = false;
                switch (true) {
                    case (shift === temp):
                        aResult = true;
                        break;
                    case ((shift === "b") && (temp.startsWith("b"))):
                        aResult = true;
                        break;
                    case (((shift === "d") || (shift === "d1") || (shift === "d2") || (shift === "d3")) && (temp === "al")):
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
        return result
    }
}

