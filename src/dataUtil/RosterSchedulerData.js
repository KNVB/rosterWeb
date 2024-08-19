import FetchAPI from "../util/FetchAPI";
import { Utility } from "../util/Utility";
import RosterViewerData from "./RosterViewerData";
export default class RosterSchedulerData extends RosterViewerData {
    async load(year, month) {
        await super.load(year, month);
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(year, month);
        this.essentialShift = temp.essentialShift;
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
    }
    updateShift(itoId, dateOfMonth, newShift){
        let oldShift = this.roster.rosterRow[itoId].shiftList[dateOfMonth];
        let newRosterShift = newShift.trim();
        switch (true) {
            case ((oldShift === undefined) && (newRosterShift !== '')):
            case ((oldShift !== undefined) && (newRosterShift !== oldShift)):
                this.roster.rosterRow[itoId].shiftList[dateOfMonth] = newRosterShift;
                break;
            default:
                break;
        }
        this.roster.rosterRow = Utility.genITOStat(this.activeShiftList,this.roster.rosterRow, this.roster.noOfWorkingDay);        
    }
    async reload(newRosterMonth) {
        await super.reload(newRosterMonth);
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterSchedulerData(rosterYear, rosterMonth + 1);
        this.preferredShiftList = structuredClone(temp.preferredShiftList);
        this.previousMonthShiftList = structuredClone(temp.previousMonthShiftList);
    }
}