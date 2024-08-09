import FetchAPI from "../util/FetchAPI";
export default class ITOManagementUtil {
    #fetchAPI;
    #itoList;
    constructor() {
        this.#fetchAPI = new FetchAPI();
        this.itoList = {};
    }
    addITO=async ito =>{
        await this.#fetchAPI.addITO(ito);
    }
    getITOList = async () => {
        this.#itoList = await this.#fetchAPI.getITOList();
        return this.#itoList;
    }
    updateITO=async ito=>{
        await this.#fetchAPI.updateITO(ito);
    }
}