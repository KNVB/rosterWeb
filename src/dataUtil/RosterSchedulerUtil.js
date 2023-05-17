import RosterViewerUtil from "./RosterViewerUtil";
import FetchAPI from "../util/FetchAPI";

export default class RosterSchedulerUtil{
    constructor(){
        let fetchAPI=new FetchAPI();
        let rosterViewerUtil=new RosterViewerUtil();
        this.getItoIdList = () => {
            return rosterViewerUtil.getItoIdList();
        }
        this.getRoster = () => {
            return rosterViewerUtil.getRoster();
        }
        this.init = async (weekdayNames) => {
            await rosterViewerUtil.init(weekdayNames);
        }
        this.loadData = async (year, month, noOfWorkingDay) => {
            await rosterViewerUtil.loadData(year,month,noOfWorkingDay);
            let temp = await fetchAPI.getRosterSchedulerData(year,month);
        }
    }
}