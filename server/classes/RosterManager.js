class RosterManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let ITO = require('./ITO');
		let ITORoster = require('./ITORoster');
		let Shift =require('./Shift');

		this.getRosterList=async (year,month)=>{
			let dboObj=new DBO();
			let itoRoster=null;
			let rosterList={};
			try{
				let results=await dboObj.getRosterList(year,month);
				results.forEach(record=>{
					//console.log(record);
					if (rosterList[record.ito_id]===undefined){
						itoRoster=new ITORoster();
						itoRoster.itoName=record.ito_name;
						itoRoster.itoPostName=record.post_name;
						itoRoster.workingHourPerDay=parseFloat(record.working_hour_per_day);
						if (record.balance)
							itoRoster.lastMonthBalance=parseFloat(record.balance);
					} else {
						itoRoster=rosterList[record.ito_id];
					}
					if (itoRoster.shiftList[record.d-1]===undefined){
						itoRoster.shiftList[record.d-1]={"d":record.d,"shift":record.shift};
					}else{
						itoRoster.shiftList[record.d-1].shift=itoRoster.shiftList[record.d-1].shift+"+"+record.shift;
					}					
					rosterList[record.ito_id]=itoRoster;
				});
				console.log("Get ("+year+","+month+") Roster List successfully!");
				return rosterList;
			} 
			catch (error){
				console.log("Something wrong when getting ("+year+","+month+") roster list:"+error);
				console.log(rosterList);
			}
			finally{
				dboObj.close();
			};	
		}
		this.getAllActiveShiftInfo=async()=>{
			let dboObj=new DBO();
			let shiftInfoList={};
			
			try{
				let results=await dboObj.getAllActiveShiftInfo();
				results.forEach(record=>{
					let shift=new Shift();
					shift.cssClassName=record.css_class_name;
					shift.duration=parseFloat(record.shift_duration);
					shift.isEssential=(record.is_essential === "1");
					shift.timeSlot=record.time_slot;
					shift.type=record.shift_type;
					shiftInfoList[shift.type]=shift;
				});
				console.log("Get All Active Shift Info. success.");
				return shiftInfoList;
			}
			catch (error){
				console.log("Something wrong when getting active shift info list:"+error);
				console.log(shiftInfoList);
			}
			finally{
				dboObj.close();
			};	
		}
	}
}
module.exports = RosterManager;