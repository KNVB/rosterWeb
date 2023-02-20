import Dbo from "./Dbo.js";
export default class SystemUtil{
    constructor() {
        let dbo = new Dbo();
        this.getSystemParam=async () =>{
            try {
                return await dbo.getSystemParam();
            }catch (error) {
                console.log("An error occur when getting system parameter from DB.");
                console.log(error);
                throw (error);
            } finally {
                dbo.close();
            }
        }
    }
}