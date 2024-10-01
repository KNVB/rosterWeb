import FetchAPI from "../util/FetchAPI";
import CalendarUtility from "../util/calendar/CalendarUtility";
import Utility from "../util/Utility";
export default class RosterViewerData{
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
        this.roster = Utility.genITOStat(this.activeShiftList, rosterData, monthlyCalendar.noOfWorkingDay);
        this.rosterMonth = new Date(year, month, 1);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
    }
}