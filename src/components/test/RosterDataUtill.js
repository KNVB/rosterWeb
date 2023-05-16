import FetchAPI from "../../util/FetchAPI";
import { Utility } from "../../util/Utility";
export default class RosterDataUtil {
    constructor() {
        let fetchAPI = new FetchAPI();
        let roster;
        this.getItoIdList = () => {
            return Object.keys(roster.rosterRow);
        }
        this.getRoster = () => {
            return roster;
        }
        this.init = async (weekdayNames) => {
            roster = { activeShiftList: await fetchAPI.getActiveShiftList() };
            roster.weekdayNames = weekdayNames;
        }
        this.loadData = async (year, month, noOfWorkingDay) => {
            roster.year = year;
            roster.month = month;
            roster.rosterRow = await fetchAPI.getRoster(year, month);
            roster.rosterRow = Utility.genITOStat(roster, noOfWorkingDay);
        }
    }
}