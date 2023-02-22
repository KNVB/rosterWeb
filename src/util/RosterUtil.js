import FetchAPI from "./fetchAPI";
import ITOShiftStatUtil from './ITOShiftStatUtil';

export default class RosterUtil {
    constructor() {
        let fetchAPI = new FetchAPI();
        this.getRosterList =async (activeShiftList,noOfWorkingDay,year, month) => {
            let results=await fetchAPI.getRosterList(year, month);
            let { getITOStat } = ITOShiftStatUtil();
            let itoIdList = Object.keys(results);
            itoIdList.forEach((itoId, i) => {
              let rosterInfo = getITOStat(activeShiftList,noOfWorkingDay, results[itoId]);              
              results[itoId] = rosterInfo;
            })
            return results;
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