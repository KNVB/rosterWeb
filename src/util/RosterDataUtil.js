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
    init = async (year, month, weekdayNames) => {
        this.#roster = { activeShiftList: await this.#fetchAPI.getActiveShiftList(), year: year, month: month };
        this.#roster.weekdayNames = weekdayNames;
    }
    loadData = async (year, month, noOfWorkingDay) => {
        this.#roster.rosterRow = await this.#fetchAPI.getRoster(year, month);
        this.#roster.rosterRow = Utility.genITOStat(this.#roster, noOfWorkingDay);
    }
    getShiftCssClassName = (shiftType) => {
        try {
            let result = this.#roster.activeShiftList[shiftType].cssClassName;
            return result
        } catch (error) {
            return null
        }
    }
    //==============================================================================================================    
}