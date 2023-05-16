import { Utility } from "./Utility";
import RosterDataUtil from "./RosterDataUtil";
import FetchAPI from "./FetchAPI";
import UndoableData from './UndoableData';
export default class RosterSchedulerDataUtil {
    #copiedData = null;
    #fetchAPI = new FetchAPI();
    #rosterDataUtil = new RosterDataUtil();
    #roster = null;
    #rosterDataHistory = null;
    #rosterSchedulerData = null;
    clearAllShiftData = (noOfWorkingDay, monthLength) => {
        Object.keys(this.#roster.rosterRow).forEach(itoId => {
            this.#roster.rosterRow[itoId].shiftList = {};
        });
        this.#updateRosterStatistic(noOfWorkingDay, monthLength);
    }
    clearCopiedData(){
        this.#copiedData = null;
    }
    copy = copyRegion => {
        let index, itoId, shiftList;
        let temp, result = [], shiftRowType;
        copyRegion.rows.forEach(row => {
            index = row.indexOf("_");
            shiftRowType = row.substring(0, index);
            itoId = row.substring(index + 1);
            temp = [];
            if (shiftRowType === "rosterRow") {
                shiftList = { ...this.#roster.rosterRow[itoId].shiftList };
            }
            if (shiftRowType === "preferredShiftRow") {
                shiftList = { ...this.#rosterSchedulerData.preferredShiftList[itoId] };
            }

            for (let i = copyRegion.column.start; i <= copyRegion.column.end; i++) {
                if (shiftList[i] === undefined) {
                    temp.push('')
                } else {
                    temp.push(shiftList[i])
                }
            }
            result.push(temp);
        });
        this.#copiedData = result;
    }
    deleteSelectedData = (selectedLocation, noOfWorkingDay, monthLength) => {
        let index, itoId, shiftRowType;
        selectedLocation.rows.forEach(rowId => {
            index = rowId.indexOf("_");
            shiftRowType = rowId.substring(0, index);
            itoId = rowId.substring(index + 1);
            for (let x = selectedLocation.column.start; x <= selectedLocation.column.end; x++) {
                console.log(rowId, x)
                if (x <= monthLength) {
                    if (shiftRowType === "rosterRow") {
                        this.updateShift(itoId, x, '', noOfWorkingDay, monthLength);
                    }
                    if (shiftRowType === "preferredShiftRow") {
                        this.updatePreferredShift(itoId, x, '');
                    }
                } else {
                    break;
                }
            }
        });
    }
    exportRosterDataToExcel = async calendarDateList => {
        let genExcelData = JSON.parse(JSON.stringify(this.#roster));
        genExcelData.calendarDateList = JSON.parse(JSON.stringify(calendarDateList));
        genExcelData.vacantShiftList = JSON.parse(JSON.stringify(this.#rosterSchedulerData.vacantShiftList));
        //console.log(genExcelData);
        await this.#fetchAPI.exportRosterDataToExcel({ "genExcelData": genExcelData });
    }
    fillEmptyShiftWithO = (monthLength) => {
        this.getItoIdList().forEach(itoId => {
            for (let i = 1; i <= monthLength; i++) {
                if ((this.#roster.rosterRow[itoId].shiftList[i] === undefined) || (this.#roster.rosterRow[itoId].shiftList[i] === '')) {
                    this.#roster.rosterRow[itoId].shiftList[i] = 'O';
                }
            }
        });
    }
    getActiveShiftList(){
        return this.#roster.activeShiftList;
    }
    getCopyDataRowCount(){
        if (this.#copiedData === null) {
            return -1;
        } else {
            return this.#copiedData.length;
        }
    }
    getItoIdList() {
        return this.#rosterDataUtil.getItoIdList();
    }
    getRoster() {
        return this.#roster
    }
    getRosterSchedulerData() {
        return this.#rosterSchedulerData;
    }
    getShiftCssClassName = shiftType => {
        return this.#rosterDataUtil.getShiftCssClassName(shiftType);
    }
    init = async (year, month, weekdayNames) => {
        await this.#rosterDataUtil.init(year, month, weekdayNames);
    }
    isDuplicateShift = (itoId, dateOfMonth) => {
        return this.#rosterSchedulerData.duplicateShiftList[itoId].includes(dateOfMonth);
    }
    loadAutoPlanResult = (autoPlanResult, noOfWorkingDay, monthLength) => {
        //console.log(autoPlanResult);
        let itoIdList = this.getItoIdList(), shiftList;
        for (let i = 0; i < itoIdList.length; i++) {
            shiftList = autoPlanResult.rosterRow[itoIdList[i]].shiftList;
            for (let [dateOfMonth, shiftType] of Object.entries(shiftList)) {
                //console.log(itoIdList[i],dateOfMonth,shiftType);
                this.updateShift(itoIdList[i], dateOfMonth, shiftType, noOfWorkingDay, monthLength);
            }
        }
    }
    loadData = async (year, month, noOfWorkingDay, monthLength) => {
        let temp = await this.#fetchAPI.getRosterSchedulerData(year, month);
        await this.#rosterDataUtil.loadData(year, month, noOfWorkingDay);
        this.#roster = this.#rosterDataUtil.getRoster();        
        this.#rosterSchedulerData = { blackListShiftList: {}, blackListShiftPattern: {}, preferredShiftList: {}, previousMonthShiftList: {} };
        this.getItoIdList().forEach(itoId => {
            this.#rosterSchedulerData.blackListShiftPattern[itoId] = JSON.parse(JSON.stringify(temp.itoBlackListShiftPattern[itoId]));
            this.#rosterSchedulerData.blackListShiftList[itoId] = {};
        });
        temp.previousMonthShiftList.forEach(previousMonthShift => {
            if (this.#rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id] === undefined) {
                this.#rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id] = [];
            }
            this.#rosterSchedulerData.previousMonthShiftList[previousMonthShift.ito_id].push(previousMonthShift.shift);
        });
        temp.preferredShiftList.forEach(preferredShift => {
            if (this.#rosterSchedulerData.preferredShiftList[preferredShift.ito_id] === undefined) {
                this.#rosterSchedulerData.preferredShiftList[preferredShift.ito_id] = {};
            }
            this.#rosterSchedulerData.preferredShiftList[preferredShift.ito_id][preferredShift.d] = preferredShift.preferred_shift;
        });

        this.#rosterSchedulerData.yearlyRosterStatistic = JSON.parse(JSON.stringify(temp.yearlyRosterStatistic));
        this.#rosterDataHistory = null;
        this.#updateRosterStatistic(noOfWorkingDay, monthLength);
        this.#backupRosterData();
    }
    paste = (dateOfMonth, rowIds, noOfWorkingDay, monthLength) => {
        let index, itoId;
        let copiedDataRow, shiftRowType;
        rowIds.forEach((rowId, rowIndex) => {
            index = rowId.indexOf("_");
            shiftRowType = rowId.substring(0, index);
            itoId = rowId.substring(index + 1);
            copiedDataRow = this.#copiedData[rowIndex];
            for (let x = dateOfMonth; x < dateOfMonth + copiedDataRow.length; x++) {
                if (x <= monthLength) {
                    if (shiftRowType === "rosterRow") {
                        this.updateShift(itoId, x, copiedDataRow[x - dateOfMonth], noOfWorkingDay, monthLength);
                    }
                    if (shiftRowType === "preferredShiftRow") {
                        this.updatePreferredShift(itoId, x, copiedDataRow[x - dateOfMonth]);
                    }
                } else {
                    break;
                }
            }
        });
    }
    reDo(){ 
        if (this.#rosterDataHistory.canRedo()) {
            let backupItem = this.#rosterDataHistory.redo();
            this.#roster.rosterRow = backupItem.rosterRow;
            this.#rosterSchedulerData = backupItem.rosterSchedulerData;
        }
    }
    saveRosterToDB = async () => {
        await this.#fetchAPI.saveRosterToDB(
            {
                rosterData:
                {
                    rosterRow: this.#roster.rosterRow,
                    preferredShiftList:this.#rosterSchedulerData.preferredShiftList,
                    month: this.#roster.month,
                    year: this.#roster.year
                }
            });
    }
    unDo(){
        if (this.#rosterDataHistory.canUndo()) {
            let backupItem = this.#rosterDataHistory.undo();
            this.#roster.rosterRow = backupItem.rosterRow;
            this.#rosterSchedulerData = backupItem.rosterSchedulerData;
        }
    }
    updatePreferredShift = (itoId, dateOfMonth, newShift) => {
        let oldPreferredShift;
        try {
            oldPreferredShift = this.#rosterSchedulerData.preferredShiftList[itoId][dateOfMonth];
        } catch (error) {
            oldPreferredShift = '';
        }

        let newPreferredShift = newShift.trim();
        switch (true) {
            case ((oldPreferredShift === undefined) && (newPreferredShift !== '')):
            case ((oldPreferredShift !== undefined) && (newPreferredShift !== oldPreferredShift)):
                if (this.#rosterSchedulerData.preferredShiftList[itoId] === undefined) {
                    this.#rosterSchedulerData.preferredShiftList[itoId] = {};
                }
                this.#rosterSchedulerData.preferredShiftList[itoId][dateOfMonth] = newPreferredShift;
                this.#backupRosterData();
                break;
            default:
                break;
        }
    }
    updateShift(itoId, dateOfMonth, newShift, noOfWorkingDay, monthLength){
        let oldShift = this.#roster.rosterRow[itoId].shiftList[dateOfMonth];
        let newRosterShift = newShift.trim();
        switch (true) {
            case ((oldShift === undefined) && (newRosterShift !== '')):
            case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                this.#roster.rosterRow[itoId].shiftList[dateOfMonth] = newRosterShift;
                this.#roster.rosterRow = Utility.genITOStat(this.#roster, noOfWorkingDay);
                this.#updateRosterStatistic(monthLength);
                this.#backupRosterData();
                break;
            default:
                break;
        }
    }
    //====================================================================================================================================================
    #backupRosterData = () => {
        console.log("backup Roster Data");
        let temp = {
            rosterRow: JSON.parse(JSON.stringify(this.#roster.rosterRow)),
            rosterSchedulerData: JSON.parse(JSON.stringify(this.#rosterSchedulerData))
        }
       // console.log(temp.rosterSchedulerData.preferredShiftList);
        if (this.#rosterDataHistory === null) {
            this.#rosterDataHistory = new UndoableData(temp);
        } else {
            this.#rosterDataHistory.set(temp);
        }
    }
    #updateRosterStatistic = (monthLength) => {
        let temp = Utility.getAllITOStat(this.#roster.activeShiftList, 1, monthLength, this.#roster.rosterRow);
        //console.log(temp, roster.rosterRow);
        this.#rosterSchedulerData.duplicateShiftList = temp.duplicateShiftList;
        this.#rosterSchedulerData.vacantShiftList = temp.vacantShiftList;
    }
}