import FetchAPI from "../util/FetchAPI";
import RosterViewerData from "./RosterViewerData";
import Utility from "../util/Utility";
import UndoableData from "../util/UndoableData";
import WeekDayNames from "../util/calendar/WeekDayNames";
export default class RosterSchedulerData extends RosterViewerData {
    #copiedData = null;
    #rosterSchedulerDataHistory;
    clearAllShiftData = () => {
        Object.keys(this.roster).forEach(itoId => {
            for (let date = 1; date <= this.calendarDateList.length; date++) {
                this.roster[itoId].shiftList[date] = "";
            }
        });
        //this.roster = Utility.genITOStat(this.activeShiftList, this.noOfWorkingDay, this.roster, this.nonStandardWorkingHourSummary);
        Utility.updateITOStat(this.activeShiftList, this.roster, this.nonStandardWorkingHourSummary);
        this.#updateRosterSchedulerData();
    }
    copy = copyRegion => {
        let index, itoId;
        let result = [], shiftList, shiftRowType;
        copyRegion.rows.forEach(row => {
            index = row.indexOf("_");
            shiftRowType = row.substring(0, index);
            itoId = row.substring(index + 1);
            shiftList = undefined;
            switch (shiftRowType) {
                case "rosterRow":
                    shiftList = this.roster[itoId].shiftList;
                    break;
                case "preferredShiftRow":
                    shiftList = this.preferredShiftList[itoId];
                    break;
                default:
                    break;
            }
            let temp = [];
            if (shiftList) {
                for (let i = copyRegion.column.start; i <= copyRegion.column.end; i++) {
                    if (shiftList[i] === undefined) {
                        temp.push('');
                    } else {
                        temp.push(shiftList[i]);
                    }
                }
            } else {
                for (let i = copyRegion.column.start; i <= copyRegion.column.end; i++) {
                    temp.push('');
                }
            }
            result.push(temp);
        });
        console.log(result);
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
                //console.log(rowId, x)
                if (x <= monthLength) {
                    switch (shiftRowType) {
                        case "rosterRow":
                            this.updateShiftFromTable(itoId, x, '', noOfWorkingDay, monthLength);
                            break;
                        case "preferredShiftRow":
                            this.updatePreferredShiftFromTable(itoId, x, '');
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
    fillEmptyShiftWithO = () => {
        Object.keys(this.roster).forEach(itoId => {
            for (let date = 1; date <= this.calendarDateList.length; date++) {
                if (this.roster[itoId].shiftList[date] === "") {
                    this.roster[itoId].shiftList[date] = "O";
                }
            }
        });
        this.#updateRosterSchedulerData();
    }
    exportRosterDataToExcel() {
        let fetchAPI = new FetchAPI();
        console.log(this);
        /*
          setCaptionRow(workbook, rosterData.month, rosterData.year);
            setConditionalFormatting(worksheet1,rosterData.roster);
            setHeaderRow(worksheet1,rosterData.calendarDateList,rosterData.weekdayNames);
            setRosterData(worksheet1,rosterData.roster,rosterData.activeShiftList);
            setVacantShiftRow(rosterData.roster,worksheet1,rosterData.vacantShiftList);
        */
        fetchAPI.exportRosterDataToExcel({
            "genExcelData": {
                activeShiftList: this.activeShiftList,
                calendarDateList: this.calendarDateList,
                month: this.rosterMonth.getMonth() + 1,
                roster: this.roster,
                vacantShiftList: this.vacantShiftList,
                weekdayNames: WeekDayNames(),
                year: this.rosterMonth.getFullYear(),
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
    isBlackListedShift = (dateOfMonth, itoId) => {
        return this.blackListShiftList[itoId].includes(dateOfMonth);
    }
    isDuplicateShift = (dateOfMonth, itoId) => {
        return this.duplicateShiftList[itoId].includes(dateOfMonth);
    }
    async load(year, month) {
        await super.load(year, month);
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(year, month + 1);
        this.essentialShift = temp.essentialShift;
        this.itoIdList = Object.keys(this.roster);
        this.itoBlackListShiftPattern = structuredClone(temp.itoBlackListShiftPattern);
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
        this.nonStandardWorkingHourRecords = structuredClone(temp.nonStandardWorkingHourRecords);
        temp = Utility.getAllITOStat(this.essentialShift, 1, this.calendarDateList.length, this.itoBlackListShiftPattern, this.itoIdList, this.systemParam, this.roster);

        this.blackListShiftList = structuredClone(temp.blackListShiftList);
        this.duplicateShiftList = structuredClone(temp.duplicateShiftList);
        this.vacantShiftList = structuredClone(temp.vacantShiftList);
        this.#rosterSchedulerDataHistory = new UndoableData({
            blackListShiftList: this.blackListShiftList,
            calendarDateList: this.calendarDateList,
            duplicateShiftList: this.duplicateShiftList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            rosterRowIdList: this.rosterRowIdList,
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
                                        break
                                    case "preferredShiftRow":
                                        this.updatePreferredShiftFromPaste(itoId, x, copiedDataRow[x - dateOfMonth - (h * copyX)]);
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
    updatePreferredShiftFromTable(itoId, dateOfMonth, newShift) {
        this.preferredShiftList[itoId][dateOfMonth] = newShift;
        this.#updateRosterSchedulerData();
    }
    updatePreferredShiftFromPaste(itoId, dateOfMonth, shiftType) {
        if (this.preferredShiftList[itoId] === undefined) {
            this.preferredShiftList[itoId] = {};
        }

        this.preferredShiftList[itoId][dateOfMonth] = shiftType;
        this.#updateRosterSchedulerData();
    }
    updateShiftFromAutoPlan(planResult) {
        this.duplicateShiftList = structuredClone(planResult.duplicateShiftList);
        this.roster = structuredClone(planResult.roster);
        this.vacantShiftList = structuredClone(planResult.vacantShiftList);
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
    updateShiftFromTable(itoId, date, newShift) {
        newShift = newShift.trim();
        this.roster[itoId].shiftList[date] = newShift;
        Utility.updateITOStat(this.activeShiftList, this.roster, this.nonStandardWorkingHourSummary);
        //this.roster = Utility.genITOStat(this.activeShiftList, this.noOfWorkingDay, this.roster, this.nonStandardWorkingHourSummary);
        this.#updateRosterSchedulerData();
    }
    updateShiftFromPaste(itoId, date, shift) {
        this.updateShiftFromTable(itoId, date, shift);
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
            this.vacantShiftList = backupItem.vacantShiftList;
        }
    }
    //=========================================================================================================================================
    #updateRosterSchedulerData() {
        let temp = Utility.getAllITOStat(this.essentialShift, 1, this.calendarDateList.length, this.itoBlackListShiftPattern, this.itoIdList, this.systemParam, this.roster);
        this.blackListShiftList = structuredClone(temp.blackListShiftList);
        this.duplicateShiftList = structuredClone(temp.duplicateShiftList);
        this.vacantShiftList = structuredClone(temp.vacantShiftList);
        this.#rosterSchedulerDataHistory.set({
            blackListShiftList: this.blackListShiftList,
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