import FetchAPI from "../util/FetchAPI";
import CalendarUtility from "../util/calendar/CalendarUtility";
import ShiftDetail from "./ShiftDetail";
import Utility from "../util/Utility";
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
        this.roster = Utility.genITOStat(this.activeShiftList, rosterData, monthlyCalendar.noOfWorkingDay, temp.shiftDetailList);
        this.rosterMonth = new Date(year, month, 1);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
        this.shiftDetailList = this.#formatShiftDetailObj(temp.shiftDetailList);
    }
    getShiftCssClassName(shiftType) {
        if (this.activeShiftList[shiftType])
            return this.activeShiftList[shiftType].cssClassName;
        else
            return "";
    }
    getShiftDetail = (itoId, date) => {
        let shiftDetailDate = new Date(this.rosterMonth.getTime());
        let temp;
        shiftDetailDate.setDate(date);
        let shiftDetail = new ShiftDetail(itoId,
            this.roster[itoId].itoName,
            this.roster[itoId].itoPostName,
            shiftDetailDate);
        temp = this.roster[itoId].shiftList[date];
        if (temp) {
            let shiftTypeList = temp.split("+");
            shiftTypeList.forEach(shiftType => {
                switch (shiftType) {
                    case "t":
                        temp = this.shiftDetailList[itoId].records[date];
                        if (temp) {
                            shiftDetail.shiftList.push({
                                claimType: temp.claimType,
                                description: temp.description,
                                duration: temp.duration,
                                endTime: new Date(temp.endTime.getTime()),
                                shiftDetailId: temp.shiftDetailId,
                                "shiftType": shiftType,
                                startTime: new Date(temp.startTime.getTime()),
                                status: temp.status
                            });
                        }
                        break;
                    default:
                        shiftDetail.shiftList.push({ "shiftType": shiftType });
                }
            });
        } else {
            shiftDetail.shiftList.push({ "shiftType": undefined });
        }
        return shiftDetail;
    }
    async reload(newRosterMonth) {
        let fetchAPI = new FetchAPI();
        //console.log(newRosterMonth);
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = this.#calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        let temp = await fetchAPI.getRosterViewerData(rosterYear, rosterMonth + 1);
        this.calendarDateList = monthlyCalendar.calendarDateList;
        let rosterData = structuredClone(temp.rosterData);
        this.roster = Utility.genITOStat(this.activeShiftList, rosterData, monthlyCalendar.noOfWorkingDay, temp.shiftDetailList);
        this.rosterMonth = new Date(rosterYear, rosterMonth, 1);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
        this.shiftDetailList = this.#formatShiftDetailObj(temp.shiftDetailList);
    }
    #formatShiftDetailObj(inObj) {
        let result = {};
        for (const [itoId, shiftDetails] of Object.entries(inObj)) {
            result[itoId] = {
                records: {},
                total: shiftDetails.total
            }
            if (shiftDetails.total > 0) {
                for (const [date, shiftDetail] of Object.entries(shiftDetails.records)) {
                    result[itoId].records[date] = {
                        "claimType": shiftDetail.claimType,
                        "description": shiftDetail.description,
                        "duration": shiftDetail.duration,
                        "endTime": new Date(shiftDetail.endTime),
                        "shiftDetailId": shiftDetail.shiftDetailId,
                        "status": shiftDetail.status,
                        "startTime": new Date(shiftDetail.startTime)
                    }
                }
            }
        }
        return result;
    }
}