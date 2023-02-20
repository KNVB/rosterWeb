import Dbo from "./Dbo.js";
export default class RosterUtil {
    constructor() {
        let dbo = new Dbo();
        this.getRosterList=async (year,month) =>{
            try {
                return await dbo.getRosterList(year,month);
            }catch (error) {
                console.log("An error occur when getting roster list from DB.");
                console.log(error);
                throw (error);
            } finally {
                dbo.close();
            }
        }
    }
}