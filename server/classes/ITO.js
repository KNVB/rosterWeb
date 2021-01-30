class ITO
{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let ITORoster = require('./ITORoster');
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
		this.getLastMonthBalance=(year,month)=>{
			let dboObj=new DBO();
			return new Promise((resolve, reject) => {
				dboObj.getLastMonthBalance(year,month,this.itoId,(err,result)=>{
					if (err){
						reject(err);
					}else {
						if (result.length>0){
							resolve(result[0].balance);
						} else {
							resolve(0.0);
						}
					}
				})
			})
		}
		this.getRoster=(year,month)=>{
			let dboObj=new DBO();
			return new Promise((resolve, reject) => {
				dboObj.getRoster(year,month,this.itoId,(err,resultList)=>{
					if (err){
						reject(err);
					}else {
						let itoRoster=new ITORoster();
						let shiftList=[];
						itoRoster.itoName=this.itoName;
						itoRoster.itoPostName=this.postName;
						itoRoster.workingHourPerDay=this.workingHourPerDay;
						resultList.forEach(result=>{
							if (shiftList[result.d-1]){
								shiftList[result.d-1].shift=shiftList[result.d-1].shift+"+"+result.shift;
							}else {
								shiftList.push(result)
							}
						});
						itoRoster.shiftList=shiftList;
						resolve(itoRoster);
					}
				})
			});			
		}
	}
	static getITOList(year, month){
		let DBO=require("../utils/dbo.js");
		let dboObj=new DBO();
		let resultObj={};

		dboObj.getITOList(year, month)
		.then(resultList=>{
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
			return resultObj;
		})
		.catch(err=>{
			console.log("Some wrong when getting data:"+err);
		})
		.finally(()=>{
			dboObj.close();
		});
	}	
}
module.exports = ITO;