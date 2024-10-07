import FetchAPI from "../util/FetchAPI";
import CalendarUtility from "../util/calendar/CalendarUtility";
import Utility from "../util/Utility";
export default class RosterViewerData {
    #calendarUtility;
    constructor() {
        this.#calendarUtility = new CalendarUtility();
    }

    getShift(itoId, date) {
        let result;
        let shiftType = this.roster[itoId].shiftList[date];

        let shiftDate = new Date(this.rosterMonth.getTime());
        shiftDate.setDate(date);
        result = {
            itoId,
            itoName: this.roster[itoId].itoName,
            itoPostName: this.roster[itoId].itoPostName,
            date: shiftDate,
            shiftType: shiftType ?? "",
        }
        if (this.roster[itoId].shiftDetail.records[date]) {
            result.shiftDetail = this.roster[itoId].shiftDetail.records[date];
        }
        return result
    }
    getShiftCssClassName = shiftType => {
        if (this.activeShiftList[shiftType])
            return this.activeShiftList[shiftType].cssClassName;
        else
            return "";
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
        this.roster = Utility.genITOStat(this.activeShiftList, rosterData, monthlyCalendar.noOfWorkingDay);
        this.rosterMonth = new Date(year, month, 1);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
    }
    async reload(newRosterMonth) {
        let fetchAPI = new FetchAPI();
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = this.#calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        let temp = await fetchAPI.getRosterViewerData(rosterYear, rosterMonth + 1);
        this.calendarDateList = monthlyCalendar.calendarDateList;
        let rosterData = structuredClone(temp.rosterData);
        this.roster = Utility.genITOStat(this.activeShiftList, rosterData, monthlyCalendar.noOfWorkingDay);
        this.rosterMonth = new Date(rosterYear, rosterMonth, 1);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
    }
}