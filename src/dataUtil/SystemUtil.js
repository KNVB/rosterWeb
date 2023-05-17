import FetchAPI from "../util/FetchAPI";
export default class SystemUtil{
    constructor(){
        let fetchAPI = new FetchAPI();
        this.getSystemParam=async ()=>{
            return await fetchAPI.getSystemParam();
        }
    }
}