import Dbo from "../util/Dbo.js";
export default class TimeOffAndOverTime{
    constructor() {
    }
    getTimeOffAndOverTimeSummary = async (year, month) => {
        let dbo = new Dbo();
        let summary={}
        try{
            let resultList=await dbo.getTimeOffAndOverTimeSummary(year, month);
            resultList.forEach(record=>{
                if (record.sum === null){
                    summary[record.ito_id]=0;
                } else {
                    summary[record.ito_id]=record.sum;
                } 
            });
            return summary;
        }catch(err) {
            console.log("Some wrong when getting TimeOffAndOverTimeSummary:" + err);
        }
        finally{
            dbo.close();
        };  
    }
}