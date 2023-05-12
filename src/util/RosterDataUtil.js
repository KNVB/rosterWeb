import FetchAPI from "./FetchAPI";
import { Utility } from "./Utility";
export default class RosterDataUtil {
    #fetchAPI = new FetchAPI();
    #roster = null;
    getItoIdList = () => {
        return Object.keys(this.#roster.rosterRow);
    }
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
        if (this.#roster.rosterRow !== undefined) {
           this.#roster.rosterRow=Utility.genITOStat(this.#roster, noOfWorkingDay);
        }
    }
    //==============================================================================================================    
}