class ITOManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
        this.getITOList=async(year,month)=>{
            let dboObj=new DBO();
            let resultObj={};

            try{
                let resultList=await dboObj.getITOList(year,month);
                resultList.forEach(ito=>{
                    if (resultObj[ito.ito_id]){
                        resultObj[ito.ito_id].blackListedShiftPatternList.push(ito.black_list_pattern);
                    }else {
                        resultObj[ito.ito_id]={
                            availableShiftList:ito.available_shift.split(","),
                            itoId:ito.ito_id,
                            itoName:ito.ito_name,
                            joinDate:new Date(ito.join_date),
                            leaveDate:new Date(ito.leave_date),
                            postName:ito.post_name,
                            workingHourPerDay:parseFloat(ito.working_hour_per_day.toFixed(2)),
                            blackListedShiftPatternList:[ito.black_list_pattern]                            
                        } 
                    }
                });
                console.log("Get ITO List ("+year+","+month+")  success.");
                return resultObj;
            }
            catch(err){
                console.log("Something wrong when getting ITO list:"+erro.stack);
                throw(err);
            }
            finally{
                dboObj.close();
            }
            
        }
	}
	
}
module.exports = ITOManager;