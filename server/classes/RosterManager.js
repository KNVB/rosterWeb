class RosterManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let ITO = require('./ITO');
		let ITORoster = require('./ITORoster');

		const RosterRule = require('./RosterRule');
		/*	
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
				return rosterList;
			} 
			catch (error){
				console.log("Something wrong when getting Roster list:"+error);
				console.log(rosterList);
			}	
		}
		*/

		this.getRosterList=async (year,month)=>{
			try{
				let itoList=await ITO.getITOList(year, month);
				let rosterList={};
				let itoIdList=Object.keys(itoList);
				for (var i=0;i<itoIdList.length;i++){
					var ito=itoList[itoIdList[i]];
					var roster=await ito.getRoster(year,month);
					var lastMonthBalance=await ito.getLastMonthBalance(year,month);
					roster.lastMonthBalance=parseFloat(lastMonthBalance);
					rosterList[itoIdList[i]]=roster;
				}
				return rosterList;
			} catch (error){
				console.log("Something wrong when getting Roster list:"+error);
			}		
		}
		
		this.getRosterRule=()=>{
			return RosterRule;
		}
	}
}
module.exports = RosterManager;