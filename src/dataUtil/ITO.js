import FetchAPI from "../util/FetchAPI";
export default class ITO {
    #fetchAPI;
    constructor() {
        this.#fetchAPI = new FetchAPI();
    }
    async addITO(itoInfo) {
        return await this.#fetchAPI.addITO(itoInfo);
    }
    async getITOList() {
        return await this.#fetchAPI.getITOList();
    }
    async update(itoInfo) {
        return await this.#fetchAPI.updateITO(itoInfo);
    }
}