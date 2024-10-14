export default class AutoPlan {
    #endDate;
    #essentialShift;
    #itoIdList;
    #iterationCount;
    #preferredShiftList;
    #previousMonthShiftList;
    #roster;
    #startDate;
    #systemParam;
    constructor({
        endDate,
        essentialShift,
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
        this.#itoIdList = itoIdList;
        this.#iterationCount = iterationCount;
        this.#preferredShiftList = preferredShiftList;
        this.#previousMonthShiftList = previousMonthShiftList;
        this.#roster = roster;
        this.#startDate = startDate;
        this.#systemParam = systemParam;
    }
    doAutoPlan() {
        let tempResult = {};
        let previousMonthShiftCount = (this.#systemParam.noOfPrevDate - this.#startDate) + 1;
        let itoAvailableShift = {};

        this.#itoIdList.forEach(itoId => {
            tempResult[itoId] = this.#buildTempResult(itoId, previousMonthShiftCount);
            if (this.#preferredShiftList[itoId]) {
                itoAvailableShift[itoId] = this.#buildITOAvailableShift(itoId);
            }
        });
        let itoId = "ITO1_1999-01-01";
        let dateOfMonth = this.#startDate;
        let essentialShift=this.#essentialShift;
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
}