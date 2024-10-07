import FetchAPI from "../util/FetchAPI";
import RosterViewerData from "./RosterViewerData";
import Utility from "../util/Utility";
import UndoableData from "../util/UndoableData";

export default class RosterSchedulerData extends RosterViewerData {
    #copiedData = null;
    #rosterSchedulerDataHistory;

    copy = copyRegion => {
        let index, itoId, shiftList;
        let temp, result = [], shiftRowType;
        copyRegion.rows.forEach(row => {
            index = row.indexOf("_");
            shiftRowType = row.substring(0, index);
            itoId = row.substring(index + 1);
            temp = [];
            if (shiftRowType === "rosterRow") {
                shiftList = { ...this.roster[itoId].shiftList };
            }
            if (shiftRowType === "preferredShiftRow") {
                shiftList = { ...this.preferredShiftList[itoId] };
            }

            for (let i = copyRegion.column.start; i <= copyRegion.column.end; i++) {
                if (shiftList[i] === undefined) {
                    temp.push([{ "shiftType": '' }]);
                } else {
                    let qq = [];
                    let tempList = shiftList[i].split("+");
                    for (let j = 0; j < tempList.length; j++) {
                        let tempObj = { "shiftType": tempList[j] };
                        if (tempList[j] === "t") {
                            let obj = this.roster[itoId].shiftDetail.records[i];
                            tempObj.claimType = obj.claimType;
                            tempObj.description = obj.description;
                            tempObj.duration = obj.duration;
                            tempObj.endTime = obj.endTime;
                            tempObj.shiftDetailId = obj.shiftDetailId;
                            tempObj.startTime = obj.startTime;
                            tempObj.status = obj.status;
                        }
                        qq.push(tempObj);
                    }
                    temp.push(qq);
                }
            }
            result.push(temp);
        });
        this.#copiedData = result;
    }
    clearCopiedData = () => {
        this.#copiedData = null;
    }
    deleteSelectedData(selectedLocation, noOfWorkingDay, monthLength) {
        let index, itoId, shiftRowType;
        selectedLocation.rows.forEach(rowId => {
            index = rowId.indexOf("_");
            shiftRowType = rowId.substring(0, index);
            itoId = rowId.substring(index + 1);
            for (let x = selectedLocation.column.start; x <= selectedLocation.column.end; x++) {
                console.log(rowId, x)
                if (x <= monthLength) {
                    switch (shiftRowType) {
                        case "rosterRow":
                            this.updateShiftFromTable(itoId, x, '', noOfWorkingDay, monthLength);
                            break;
                        case "preferredShiftRow":
                            this.updatePreferredShift(itoId, x, '');
                            break;
                        default:
                            break;
                    }
                } else {
                    break;
                }
            }
        });
    }
    getCopyDataRowCount = () => {
        if (this.#copiedData === null) {
            return -1;
        } else {
            return this.#copiedData.length;
        }
    }
    getShift(itoId, date) {
        super.getShift(itoId, date);
        console.log(itoId, date);
        /*
        let shift = super.getShift(itoId, date);
        alert(shift);
        
        if ((shift.shiftType === "t") && (shift.shiftDetail === undefined)) {
            shift.shiftDetail={
                records:{},
                "total":0
            }
        }
        return shift
        */
    }
    async load(year, month) {
        await super.load(year, month);
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(year, month + 1);
        this.#rosterSchedulerDataHistory = null;
        this.essentialShift = temp.essentialShift;
        this.itoIdList = Object.keys(this.roster);
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
        temp = Utility.getAllITOStat(this.essentialShift, 1, this.calendarDateList.length, this.roster);

        this.duplicateShiftList = structuredClone(temp.duplicateShiftList);
        this.vacantShiftList = structuredClone(temp.vacantShiftList);
        this.#rosterSchedulerDataHistory = new UndoableData({
            calendarDateList: this.calendarDateList,
            duplicateShiftList: this.duplicateShiftList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            rosterRowIdList: this.rosterRowIdList,
            shiftDetailList: this.shiftDetailList,
            vacantShiftList: this.vacantShiftList
        });
    }
    paste = (dateOfMonth, rosterRowIdList, selectedLocation) => {
        let copiedDataRow, copyX = this.#copiedData[0].length, copyY = this.#copiedData.length;
        let endRowNo, endX, endY, firstRowNo, index, itoId, rowId;
        let shiftRowType, startX, startY;

        firstRowNo = rosterRowIdList.indexOf(selectedLocation.rows[0]);
        endRowNo = rosterRowIdList.length - 1;

        let selectX = selectedLocation.column.end - selectedLocation.column.start + 1;
        let selectY = selectedLocation.rows.length;

        let horizontalCopyTime = Math.floor(selectX / copyX);
        let verticalCopyTime = Math.floor(selectY / copyY);

        if (horizontalCopyTime === 0) {
            horizontalCopyTime = 1;
        }
        if (verticalCopyTime === 0) {
            verticalCopyTime = 1;
        }
        for (let v = 0; v < verticalCopyTime; v++) {
            startY = firstRowNo + (v * copyY);
            endY = startY + copyY;
            //console.log("startY="+startY+",endY="+endY);
            for (let y = startY; y < endY; y++) {
                if (y <= endRowNo) {
                    rowId = rosterRowIdList[y];
                    index = rowId.indexOf("_");
                    shiftRowType = rowId.substring(0, index);
                    itoId = rowId.substring(index + 1);
                    copiedDataRow = this.#copiedData[y - firstRowNo - (v * copyY)];
                    //console.log(`rowId=${rowId},shiftRowType=${shiftRowType},itoId=${itoId},copiedDataRow=${copiedDataRow}`);
                    for (let h = 0; h < horizontalCopyTime; h++) {
                        startX = dateOfMonth + (h * copyX);
                        endX = startX + copiedDataRow.length;
                        for (let x = startX; x < endX; x++) {
                            if (x <= this.calendarDateList.length) {
                                switch (shiftRowType) {
                                    case "rosterRow":
                                        this.updateShiftFromPaste(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)]);
                                        //this.roster[itoId].shiftList[x] = shiftType.join("+");
                                        //this.updateShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)], this.noOfWorkingDay, this.calendarDateList.length);
                                        break
                                    case "preferredShiftRow":
                                        this.updatePreferredShiftFromPaste(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)]);
                                        //this.updatePreferredShift(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)]);
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                } else {
                    break;
                }
            }
        }
    }
    reDo = () => {
        console.log("redo");
        if (this.#rosterSchedulerDataHistory.canRedo()) {
            let backupItem = this.#rosterSchedulerDataHistory.redo();
            this.calendarDateList = backupItem.calendarDateList;
            this.duplicateShiftList = backupItem.duplicateShiftList;
            this.itoIdList = backupItem.itoIdList
            this.rosterRowIdList = backupItem.rosterRowIdList;
            this.preferredShiftList = backupItem.preferredShiftList
            this.previousMonthShiftList = backupItem.previousMonthShiftList
            this.roster = backupItem.roster;
            this.shiftDetailList = backupItem.shiftDetailList;
            this.vacantShiftList = backupItem.vacantShiftList;
        }
    }
    async reload(newRosterMonth) {
        await super.reload(newRosterMonth);
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(rosterYear, rosterMonth + 1);
        this.itoIdList = Object.keys(this.roster);
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
        this.#updateRosterSchedulerData();
    }
    unDo = () => {
        console.log("undo");
        if (this.#rosterSchedulerDataHistory.canUndo()) {
            let backupItem = this.#rosterSchedulerDataHistory.undo();
            this.calendarDateList = backupItem.calendarDateList;
            this.duplicateShiftList = backupItem.duplicateShiftList;
            this.itoIdList = backupItem.itoIdList
            this.rosterRowIdList = backupItem.rosterRowIdList;
            this.preferredShiftList = backupItem.preferredShiftList
            this.previousMonthShiftList = backupItem.previousMonthShiftList
            this.roster = backupItem.roster;
            this.shiftDetailList = backupItem.shiftDetailList;
            this.vacantShiftList = backupItem.vacantShiftList;
        }
    }
    updatePreferredShift(itoId, dateOfMonth, newShift) {
        if (this.preferredShiftList[itoId] === undefined) {
            this.preferredShiftList[itoId] = {};
        }
        this.preferredShiftList[itoId][dateOfMonth] = newShift;
        this.#updateRosterSchedulerData();
    }
    updatePreferredShiftFromPaste(itoId, dateOfMonth, shiftObj) {
        let temp = [];
        shiftObj.forEach(shift => {
            temp.push(shift.shiftType);
        });
        if (this.preferredShiftList[itoId] === undefined) {
            this.preferredShiftList[itoId] = {};
        }
        this.preferredShiftList[itoId][dateOfMonth] = temp.join("+");
        this.#updateRosterSchedulerData();
    }
    updateShiftFromModal(shiftObj) {
        console.log(shiftObj);
        let dateOfMonth = shiftObj.date.getDate();
        let shiftTypeList = [], shiftDetailTotal = 0;
        shiftObj.shiftDetailList.forEach(item => {
            shiftTypeList.push(item.shiftType);
            item.shiftDetailList.forEach(detailObj => {
                console.log(detailObj)
            });
        })
        this.roster[shiftObj.itoId].shiftList[dateOfMonth] = shiftTypeList.join("+");
        this.roster = Utility.genITOStat(this.activeShiftList, this.roster, this.noOfWorkingDay);
        this.#updateRosterSchedulerData();
    }
    updateShiftFromPaste(itoId, date, shiftObj) {
        let temp = [];
        shiftObj.forEach(shift => {
            temp.push(shift.shiftType);
        });
        this.roster[itoId].shiftList[date] = temp.join("+");
        this.roster = Utility.genITOStat(this.activeShiftList, this.roster, this.noOfWorkingDay);
        this.#updateRosterSchedulerData();
    }
    updateShiftFromTable(itoId, date, newShift) {
        if (this.roster[itoId].shiftList[date] !== newShift) {
            this.roster[itoId].shiftList[date] = newShift;
            this.roster = Utility.genITOStat(this.activeShiftList, this.roster, this.noOfWorkingDay);
            this.#updateRosterSchedulerData();
        }
    }
    //=========================================================================================================================================
    #updateRosterSchedulerData() {
        let temp = Utility.getAllITOStat(this.essentialShift, 1, this.calendarDateList.length, this.roster);
        this.duplicateShiftList = structuredClone(temp.duplicateShiftList);
        this.vacantShiftList = structuredClone(temp.vacantShiftList);
        this.#rosterSchedulerDataHistory.set({
            calendarDateList: this.calendarDateList,
            duplicateShiftList: this.duplicateShiftList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            shiftDetailList: this.shiftDetailList,
            vacantShiftList: this.vacantShiftList
        });
    }
}