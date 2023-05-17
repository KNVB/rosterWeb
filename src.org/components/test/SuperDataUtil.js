import DataUtil from "./DataUtil";
export default class SuperDataUtil{
    constructor(){
        let dataUtil=new DataUtil();
        this.getRoster = () => {
            return dataUtil.getRoster();
        }
        this.init = async weekdayNames => {
            await dataUtil.init(weekdayNames);
        }
        this.loadData = async (year, month, noOfWorkingDay, monthLength) => {
            await dataUtil.loadData(year, month, noOfWorkingDay, monthLength);
        }
    }
}