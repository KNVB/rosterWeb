import FetchAPI from "../util/FetchAPI";
import CalendarUtility from "../util/calendar/CalendarUtility";
import { Utility } from "../util/Utility";
export default class RosterViewerData {
    #calendarUtility;
    constructor() {
        this.#calendarUtility = new CalendarUtility();
    }
    async load(year, month) {
        let monthlyCalendar = this.#calendarUtility.getMonthlyCalendar(year, month);
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterViewerData(year, month + 1);
        this.activeShiftList = structuredClone(temp.activeShiftList);
        this.calendarDateList = monthlyCalendar.calendarDateList;
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
        this.systemParam.noOfPrevDate = 0;

        let rosterData = structuredClone(temp.rosterData);
        this.roster = Utility.genITOStat(this.activeShiftList, rosterData, monthlyCalendar.noOfWorkingDay, temp.timeOffList);
        this.rosterMonth = new Date(year, month, 1);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
        this.timeOffList = this.#formatTimeOffObj(temp.timeOffList);
    }
    getShiftCssClassName(shiftType) {
        if (this.activeShiftList[shiftType])
            return this.activeShiftList[shiftType].cssClassName;
        else
            return "";
    }
    async reload(newRosterMonth) {
        let fetchAPI = new FetchAPI();
        //console.log(newRosterMonth);
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = this.#calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        let temp = await fetchAPI.getRosterViewerData(rosterYear, rosterMonth + 1);
        this.calendarDateList = monthlyCalendar.calendarDateList;
        let rosterData = structuredClone(temp.rosterData);
        this.roster = Utility.genITOStat(this.activeShiftList, rosterData, monthlyCalendar.noOfWorkingDay, temp.timeOffList);
        this.rosterMonth = new Date(rosterYear, rosterMonth, 1);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
        this.timeOffList = this.#formatTimeOffObj(temp.timeOffList);
    }
    #formatTimeOffObj(inObj) {
        let result = {};
        for (const [itoId, timeOffRecords] of Object.entries(inObj)) {
            //console.log(itoId, timeOffRecords);
            result[itoId] = {
                records: {},
                total: timeOffRecords.total
            }
            if (timeOffRecords.total > 0) {
                for (const [date, timeOffRecord] of Object.entries(timeOffRecords.records)) {
                    result[itoId].records[date] = {
                        "description": timeOffRecord.description,
                        timeOffAmount: timeOffRecord.timeOffAmount,
                        timeOffEnd: new Date(timeOffRecord.timeOffEnd),
                        timeOffId: timeOffRecord.timeOffId,
                        timeOffStart: new Date(timeOffRecord.timeOffStart),
                        timeOffStatus: timeOffRecord.timeOffStatus,
                    }
                }
            }
        }
        return result;
    }
}