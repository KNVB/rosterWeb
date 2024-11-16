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
        let result = await this.#fetchAPI.getITOTimeOffList(year, month + 1);
        //console.log(this.#formatTimeOffObj(result));
        return this.#formatTimeOffObj(result);
    }
    async update(timeOffInfo) {
        return await this.#fetchAPI.updateTimOff(timeOffInfo);
    }
    #formatTimeOffObj(inObj) {
        let result = {};
        for (const [key, value] of Object.entries(inObj)) {
            result[key] = {
                name: value.name,
                postName: value.postName,
                records: {},
                total: value.total
            };
            console.log(value.records);
        }

        return result;
    }
}