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
        let tempResult = {};

        let previousMonthShiftCount = (this.#systemParam.noOfPrevDate - this.#startDate) + 1;
        let itoAvailableShift, itoAvailableShiftList = {};


        this.#itoIdList.forEach(itoId => {
            tempResult[itoId] = this.#buildTempResult(itoId, previousMonthShiftCount);
            //console.log(itoId, this.#buildTempResult(itoId, previousMonthShiftCount));
            if (this.#preferredShiftList[itoId]) {
                itoAvailableShiftList[itoId] = this.#buildITOAvailableShift(itoId);
            }
        });

        //let itoId = "ITO1_1999-01-01";
        //let itoId = "ITO3_2023-07-12";
        //let itoId = "ITO5_2021-09-09";
        //let itoId = "ITO8_1999-01-01";

        /*
        itoAvailableShift = {};
        this.#itoIdList.forEach(itoId => {
            if (itoAvailableShiftList[itoId]) {
                itoAvailableShift = itoAvailableShiftList[itoId];
            }
        });*/

        //console.log(itoAvailableShift);
        for (let dateOfMonth = this.#startDate; dateOfMonth <= this.#endDate; dateOfMonth++) {
            let assignedShift = "";
            let shuffledITOId = structuredClone(this.#itoIdList)
            Utility.shuffleArray(shuffledITOId);            
            shuffledITOId.forEach(itoId => {
                let isAssigned = false, preShift = [], temp;
                itoAvailableShift = {};
                if (itoAvailableShiftList[itoId]) {
                    itoAvailableShift = itoAvailableShiftList[itoId];
                }
                console.log(itoId,itoAvailableShift);
                for (let j = tempResult[itoId].length - this.#systemParam.noOfPrevDate; j < tempResult[itoId].length; j++) {
                    preShift.push(tempResult[itoId][j].shiftType);
                }
                preShift = preShift.join(",");
                for (let i = 0; i < this.#essentialShift.length; i++) {
                    if (assignedShift.indexOf(this.#essentialShift[i]) === -1) {
                        temp = preShift + "," + this.#essentialShift[i];
                        if ((Object.keys(itoAvailableShift).length === 0) ||
                        (itoAvailableShift[dateOfMonth] === undefined) ||
                        itoAvailableShift[dateOfMonth].includes(this.#essentialShift[i])){
                            if (!this.#isBlackListShift(itoId, temp)) {
                                tempResult[itoId].push({ "shiftType": this.#essentialShift[i] });
                                isAssigned = true;
                                assignedShift += this.#essentialShift[i];
                                break;
                            }
                        }
                    }
                }
                if (!isAssigned) {
                    tempResult[itoId].push({ "shiftType": "" });
                }
            });
        }
        //console.log(essentialShift.length);
        console.log(tempResult);
        //console.log(tempResult[itoId]);
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
                        if (shift === temp[j]) {
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
}