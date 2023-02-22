import FetchAPI from "./fetchAPI";
export default class RosterUtil {
    constructor() {
        let fetchAPI = new FetchAPI();
        this.getRosterList = (year, month) => {
            return fetchAPI.getRosterList(year, month);
        }
        /*
        this.getRosterViewerData = (year, month) => {
            return fetchAPI.getRosterViewerData(year, month);
        }
        this.getRosterSchedulerData = (year, month) => {
            return fetchAPI.getRosterSchedulerData(year, month);
        }
        */
    }
}