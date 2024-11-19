import FetchAPI from "../util/FetchAPI";
import RosterViewerData from "./RosterViewerData";
import Utility from "../util/Utility";
import UndoableData from "../util/UndoableData";
export default class RosterSchedulerData extends RosterViewerData {
    #copiedData = null;
    #rosterSchedulerDataHistory;
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
        temp = Utility.getAllITOStat(this.essentialShift, 1, this.calendarDateList.length, this.itoIdList, this.roster);

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
            vacantShiftList: this.vacantShiftList
        });
    }
    updatePreferredShiftFromTable(itoId, dateOfMonth, newShift) {
        this.preferredShiftList[itoId][dateOfMonth] = newShift;
        this.#updateRosterSchedulerData();
    }
    updateShiftFromTable(itoId, date, newShift) {
        newShift = newShift.trim();        
        this.roster[itoId].shiftList[date] = newShift;
        this.roster = Utility.genITOStat(this.activeShiftList, this.noOfWorkingDay, this.roster,this.nonStandardWorkingHourSummary);
        this.#updateRosterSchedulerData();
    }
    //=========================================================================================================================================
    #updateRosterSchedulerData() {
        let temp = Utility.getAllITOStat(this.essentialShift, 1, this.calendarDateList.length, this.itoIdList, this.roster);
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