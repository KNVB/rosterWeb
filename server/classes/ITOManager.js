class ITOManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
        this.getActiveITOList=async(year,month)=>{
            let dboObj=new DBO();
            let resultObj={};

            try{
                let resultList=await dboObj.getActiveITOList(year,month);
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
                console.log("Get Active ITO List ("+year+","+month+")  success.");
                return resultObj;
            }
            catch(err){
                console.log("Something wrong when getting Active ITO list:"+erro.stack);
                throw(err);
            }
            finally{
                dboObj.close();
            }            
        }
        this.getAllITOList=async()=>{
            let dboObj=new DBO();
            let resultObj={};
            try{
                let resultList=await dboObj.getAllITOList();
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
                console.log("Get All ITO List success.");
                return resultObj;
            }
            catch(err){
                console.log("Something wrong when getting All ITO list:"+err.stack);
                throw(err);
            }
            finally{
                dboObj.close();
            }

        }
        this.saveITOInfoToDB=async(ito)=>{
            let dboObj=new DBO();
			try{
				let result=await dboObj.saveITOInfoToDB(ito);
				return result;
			}catch(err){
				console.log("Some wrong when update ITO info:"+err.stack);
				throw new Error("Some wrong when update the ITO info.");
			}
			finally{
				dboObj.close();
			};
        }
	}
	
}
module.exports = ITOManager;