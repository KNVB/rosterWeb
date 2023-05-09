import FetchAPI from "./fetchAPI";
export default class ShiftUtil{
    constructor() {
        let fetchAPI = new FetchAPI();
        this.getActiveShiftList=()=>{
            return fetchAPI.getActiveShiftList();
        }
        this.getITOBlackListShiftPattern= async (year, month)=>{
            return fetchAPI.getITOBlackListShiftPattern(year, month);
        }
    }
}