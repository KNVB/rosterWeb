import FetchAPI from "../util/FetchAPI";
import { Utility } from "../util/Utility";
import UndoableData from "../util/UndoableData";
import RosterViewerData from "./RosterViewerData";
export default class RosterSchedulerData extends RosterViewerData {
    #rosterSchedulerDataHistory;
    constructor() {
        super();
        this.copiedData = null
    }
    copy = () => {

    }
    clearCopiedData = () => {
        this.copiedData = null;
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
                            this.updateShift(itoId, x, '', noOfWorkingDay, monthLength);
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
    async load(year, month) {
        await super.load(year, month);
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(year, month);
        this.#rosterSchedulerDataHistory = null;
        this.essentialShift = temp.essentialShift;
        this.itoIdList = Object.keys(this.roster.rosterRow);
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
        this.timeOffList = structuredClone(temp.timeOffList);
        this.#rosterSchedulerDataHistory = new UndoableData({
            calendarDateList: this.calendarDateList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            timeOffList: this.timeOffList
        });
    }
    reDo = () => {
        console.log("redo");
        if (this.#rosterSchedulerDataHistory.canRedo()) {
            let backupItem = this.#rosterSchedulerDataHistory.redo();
            this.calendarDateList = backupItem.calendarDateList;
            this.itoIdList = backupItem.itoIdList
            this.preferredShiftList = backupItem.preferredShiftList
            this.previousMonthShiftList = backupItem.previousMonthShiftList
            this.roster = backupItem.roster;
        }
    }
    unDo = () => {
        console.log("undo");
        if (this.#rosterSchedulerDataHistory.canUndo()) {
            let backupItem = this.#rosterSchedulerDataHistory.undo();
            this.calendarDateList = backupItem.calendarDateList;
            this.itoIdList = backupItem.itoIdList
            this.preferredShiftList = backupItem.preferredShiftList
            this.previousMonthShiftList = backupItem.previousMonthShiftList
            this.roster = backupItem.roster;
        }
    }
    updatePreferredShift(itoId, dateOfMonth, newShift) {
        let oldPreferredShift = '';
        try {
            oldPreferredShift = this.preferredShiftList[itoId][dateOfMonth];
        } catch (error) {
            if (this.preferredShiftList[itoId] === undefined) {
                this.preferredShiftList[itoId] = {};
            }
        } finally {
            let newPreferredShift = newShift.trim();
            if (newPreferredShift !== oldPreferredShift) {
                this.preferredShiftList[itoId][dateOfMonth] = newPreferredShift;
                this.#recordRosterSchedulerData();
            }
        }
    }
    updateShift(itoId, dateOfMonth, newShift) {
        let oldShift = this.roster.rosterRow[itoId].shiftList[dateOfMonth];
        let newRosterShift = newShift.trim();
        switch (true) {
            case ((oldShift === undefined) && (newRosterShift !== '')):
            case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                this.roster.rosterRow[itoId].shiftList[dateOfMonth] = newRosterShift;
                this.roster.rosterRow = Utility.genITOStat(this.activeShiftList, this.roster.rosterRow, this.roster.noOfWorkingDay);
                this.#recordRosterSchedulerData();
                break;
            default:
                break;
        }
    }
    async reload(newRosterMonth) {
        await super.reload(newRosterMonth);
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(rosterYear, rosterMonth);
        this.itoIdList = Object.keys(this.roster.rosterRow);
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
        this.timeOffList = structuredClone(temp.timeOffList);
        this.#recordRosterSchedulerData();
    }
    //=========================================================================================================================================
    #recordRosterSchedulerData() {
        this.#rosterSchedulerDataHistory.set({
            calendarDateList: this.calendarDateList,
            itoIdList: this.itoIdList,
            preferredShiftList: this.preferredShiftList,
            previousMonthShiftList: this.previousMonthShiftList,
            roster: this.roster,
            timeOffList: this.timeOffList
        });
    }
}