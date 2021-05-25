class ITOManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
        let ITO=require('./ITO');
        this.getITOList=async(year,month)=>{
            let dboObj=new DBO();
            let resultObj={};

            try{
                let resultList=await dboObj.getITOList(year,month);
                resultList.forEach(ito=>{
                    let itoObj;
                    if (resultObj[ito.ito_id]){
                        itoObj=resultObj[ito.ito_id];
                        itoObj.blackListedShiftPatternList.push(ito.black_list_pattern);
                    }else {
                        itoObj=new ITO();
                        itoObj.itoId=ito.ito_id;
                        itoObj.itoName=ito.ito_name;
                        itoObj.postName=ito.post_name;
                        itoObj.workingHourPerDay=parseFloat(ito.working_hour_per_day.toFixed(2));
                        itoObj.joinDate=new Date(ito.join_date);
                        itoObj.leaveDate=new Date(ito.leave_date);
                        itoObj.availableShiftList=ito.available_shift.split(",");
                        itoObj.blackListedShiftPatternList.push(ito.black_list_pattern);
                    }
                    resultObj[ito.ito_id]=itoObj;
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