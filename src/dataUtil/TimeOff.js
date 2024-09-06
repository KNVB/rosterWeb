import FetchAPI from "../util/FetchAPI";
export default class TimeOff {
    #fetchAPI;
    constructor() {
        this.#fetchAPI = new FetchAPI();
    }
    async addTimeOFf(timeOffInfo) {
        return await this.#fetchAPI.addTimeOff(timeOffInfo);
    }
    async getITOTimeOffList(year, month) {
        let result=await this.#fetchAPI.getITOTimeOffList(year, month + 1);
        //console.log(this.#formatTimeOffObj(result));
        return  this.#formatTimeOffObj(result);
    }
    async update(timeOffInfo) {
        return await this.#fetchAPI.updateTimOff(timeOffInfo);
    }
    #formatTimeOffObj(inObj){
        let result={};
        for (const [key, value] of Object.entries(inObj)) {
            result[key] = {
                name:value.name,
                postName:value.postName,
                records: [],
                total: value.total
            };
            value.records.forEach(v=>{
                result[key].records.push({
                    timeOffEnd:new Date(v.timeOffEnd),
                    timeOffId:v.timeOffId,
                    timeOffStart:new Date(v.timeOffStart),
                    timeOffAmount:v.timeOffAmount,
                    "description":v.description
                })     
            });
        }
       return result;
    }
}