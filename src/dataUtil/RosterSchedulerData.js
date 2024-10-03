import FetchAPI from "../util/FetchAPI";
import RosterViewerData from "./RosterViewerData";
import Utility from "../util/Utility";
import UndoableData from "../util/UndoableData";

export default class RosterSchedulerData extends RosterViewerData {
    #copiedData = null;
    #rosterSchedulerDataHistory;
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
    updateShiftFromTable(itoId, date, newShift) {
        this.roster[itoId].shiftList[date] = newShift;
        this.roster = Utility.genITOStat(this.activeShiftList, this.roster, this.noOfWorkingDay);
        this.#updateRosterSchedulerData();
    }
    //=========================================================================================================================================
    #updateRosterSchedulerData(){
        let temp = Utility.getAllITOStat(this.essentialShift, 1, this.calendarDateList.length, this.roster);
        this.duplicateShiftList = structuredClone(temp.duplicateShiftList);
        this.vacantShiftList = structuredClone(temp.vacantShiftList);
        this.#recordRosterSchedulerData();
    }
    #recordRosterSchedulerData() {
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