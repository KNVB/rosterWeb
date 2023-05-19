import FetchAPI from "../util/FetchAPI";
export default class ITOManagementUtil {
    constructor() {
        let activeShiftList = {};
        let fetchAPI = new FetchAPI();
        let itoList = {};
        this.addITO=async ito =>{
            await fetchAPI.addITO(ito);
        }
        this.getActiveShiftList = async () => {
            activeShiftList = await fetchAPI.getActiveShiftList();
            return activeShiftList;
        }
        this.getITOList = async () => {
            itoList = await fetchAPI.getITOList();
            return itoList;
        }
        this.updateITO=async ito=>{
            await fetchAPI.updateITO(ito);
        }
    }
}