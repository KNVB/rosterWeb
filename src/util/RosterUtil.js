import FetchAPI from "./fetchAPI";
export default class RosterUtil{
    constructor(){
        let fetchAPI = new FetchAPI();
        this.getRosterViewerData= (year,month) =>{
            return fetchAPI.getRosterViewerData(year,month);
        }
    }
}