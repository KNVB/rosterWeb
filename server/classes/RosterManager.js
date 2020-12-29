class RosterManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let ITO=require("./ITO.js");
		const RosterRule = require('./RosterRule');
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