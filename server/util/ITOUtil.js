import Dbo from "./Dbo.js";
export default class ITOUtil{
    constructor() {
        this.getITOList = async () =>{
            let dboObj = new Dbo();
            try{
                let queryResult = await dboObj.getITOList();
                let result={};
                queryResult.forEach(record=>{
                    if (result[record.ito_id] === undefined){
                        result[record.ito_id]={
                            availableShift:record.available_shift.split(","),
                            blackListedShiftPattern:[record.black_list_pattern],
                            itoId:record.ito_id,
                            joinDate:record.join_date,
                            leaveDate:record.leave_date,
                            name:record.ito_name,
                            post:record.post_name,
                            workingHourPerDay:record.working_hour_per_day
                        };
                    } else {
                        result[record.ito_id].blackListedShiftPattern.push(record.black_list_pattern);
                    }
                })
                return result;
            }catch (error) {
				console.log("Something wrong when getting ITO list:" + error);
				throw (error);
			}
			finally {
				dboObj.close();
			};
        }
    }
}