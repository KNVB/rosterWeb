import FetchAPI from "./fetchAPI";
export default class ShiftUtil{
    constructor() {
        let fetchAPI = new FetchAPI();
        this.getActiveShiftList=()=>{
            return fetchAPI.getActiveShiftList();
        }
    }
}