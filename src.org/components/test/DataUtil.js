import FetchAPI from "../../util/FetchAPI";
import { Utility } from "../../util/Utility";
export default class DataUtil{
    #fetchAPI = new FetchAPI();
    #roster = null;
    getRoster = () => {
        return this.#roster;
    }
    init = async (weekdayNames) => {
        this.#roster = { activeShiftList: await this.#fetchAPI.getActiveShiftList()};
        this.#roster.weekdayNames = weekdayNames;
        
    }
    loadData = async (year, month, noOfWorkingDay, monthLength) => {
        this.#roster.month = month;
        this.#roster.year = year;
        this.#roster.rosterRow = await this.#fetchAPI.getRoster(year, month);
        this.#roster.rosterRow=Utility.genITOStat(this.#roster, noOfWorkingDay);
    }
}