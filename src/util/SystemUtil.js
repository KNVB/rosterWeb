import FetchAPI from "./fetchAPI";
export default class SystemUtil{
    constructor() {
        let fetchAPI = new FetchAPI();
        this.getSystemParam=()=>{
            return fetchAPI.getSystemParam();
        }
    }
}