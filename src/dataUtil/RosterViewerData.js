import FetchAPI from "../util/FetchAPI";
import CalendarUtility from "../util/calendar/CalendarUtility";
import Utility from "../util/Utility";
export default class RosterViewerData {
    #calendarUtility;
    constructor() {
        this.#calendarUtility = new CalendarUtility();
    }    
    getShiftCssClassName(shiftType) {
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
        this.nonStandardWorkingHourSummary=structuredClone(temp.nonStandardWorkingHourSummary);
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
        this.systemParam.noOfPrevDate = 0;

        let rosterData = structuredClone(temp.rosterData);
        this.rosterMonth = new Date(year, month, 1);
        //this.roster = Utility.genITOStat(this.activeShiftList, monthlyCalendar.noOfWorkingDay, rosterData,temp.nonStandardWorkingHourSummary);
        this.roster = Utility.initRoster(monthlyCalendar,rosterData,this.rosterMonth);
        Utility.updateITOStat(this.activeShiftList, this.roster, this.nonStandardWorkingHourSummary);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;

        //console.log(this.roster);
    }
    async reload(newRosterMonth) {
        let fetchAPI = new FetchAPI();
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = this.#calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        let temp = await fetchAPI.getRosterViewerData(rosterYear, rosterMonth + 1);
        this.calendarDateList = monthlyCalendar.calendarDateList;
        this.nonStandardWorkingHourSummary=structuredClone(temp.nonStandardWorkingHourSummary);
        let rosterData = structuredClone(temp.rosterData);
        //this.roster = Utility.genITOStat(this.activeShiftList, monthlyCalendar.noOfWorkingDay, rosterData,temp.nonStandardWorkingHourSummary);
        this.rosterMonth = new Date(rosterYear, rosterMonth, 1);
        this.roster = Utility.initRoster(monthlyCalendar,rosterData,this.rosterMonth);
        Utility.updateITOStat(this.activeShiftList, this.roster, this.nonStandardWorkingHourSummary);
        
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
    }
}