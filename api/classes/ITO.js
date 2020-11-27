class ITO
{
	constructor(){
		/**
		 * The ITO Id of the specified ITO.
		 */
		this.itoId="";
		/**
		 * The name of the specified ITO.
		 */
		this.itoName="";
		/**
		 * The post name of the specified ITO
		 */
		this.postName="";
	
		/**
		 * The total no. of working hour per day for the specified ITO.
		 */
		this.workingHourPerDay=0.0;
		/**
		 * The join date of the specified ITO.
		 */
		this.joinDate=null;
		/**
		 * The leave date of the specified ITO.
		 */
		this.leaveDate=null;
		/**
		 * The available shift list of the specified ITO.	
		 */
		this.availableShiftList=[];
		/**
		 * The black listed shift pattern list of the specified ITO.	
		 */
		this.blackListedShiftPatternList=[];		
	}
	static async getITOList(year, month){
		let DBO=require("../utils/dbo.js");
		let dboObj=new DBO();
		let itoList=await dboObj.getITOList(year, month);
		let resultObj={};
		itoList.forEach(ito=>{
			let itoObj;
			if (resultObj[ito.ito_id]){
				itoObj=resultObj[ito.ito_id];
				itoObj.blackListedShiftPatternList.push(ito.black_list_pattern);
			}else {
				itoObj=new ITO();
				itoObj.itoId=ito.ito_id;
				itoObj.itoName=ito.ito_name;
				itoObj.postName=ito.post_name;
				itoObj.workingHourPerDay=ito.working_hour_per_day;
				itoObj.joinDate=new Date(ito.join_date);
				itoObj.leaveDate=new Date(ito.leave_date);
				itoObj.availableShiftList=ito.available_shift.split(",");
				itoObj.blackListedShiftPatternList.push(ito.black_list_pattern);
			}
			resultObj[ito.ito_id]=itoObj;
		});
		return (resultObj);
	}
}
module.exports = ITO;