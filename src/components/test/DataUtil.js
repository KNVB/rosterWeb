import FetchAPI from "../../util/FetchAPI";
import { Utility } from "../../util/Utility";
export default class DataUtil{
    #fetchAPI = new FetchAPI();
    #roster = null;
    getRoster = () => {
        return this.#roster;
    }
    init = async (year, month, noOfWorkingDay, monthLength, weekdayNames) => {
        this.#roster = { activeShiftList: await this.#fetchAPI.getActiveShiftList(), year: year };
        this.#roster.weekdayNames = weekdayNames;
        await this.loadData(year, month, noOfWorkingDay, monthLength);
    }
    loadData = async (year, month, noOfWorkingDay, monthLength) => {
        this.#roster.rosterRow = await this.#fetchAPI.getRoster(year, month);
        this.#roster.rosterRow=Utility.genITOStat(this.#roster, noOfWorkingDay);
    }
}