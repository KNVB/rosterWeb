import FetchAPI from "../util/FetchAPI";
export default class ITOManagementUtil {
    #fetchAPI;
    #itoList;
    constructor() {
        this.#fetchAPI = new FetchAPI();
        this.itoList = {};
    }
    getITOList = async () => {
        this.#itoList = await this.#fetchAPI.getITOList();
        return this.#itoList;
    }
    updateITO=async ito=>{
        await this.#fetchAPI.updateITO(ito);
    }
}