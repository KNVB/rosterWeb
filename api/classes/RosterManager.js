class RosterManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let ITO=require("./ITO.js");
		const RosterRule = require('./RosterRule');
		this.getRosterList=async (year,month)=>{
			let dboObj=new DBO();
			let itoList=await ITO.getITOList(year, month);		
			let rosterList={};
			Object.keys(itoList).forEach(async itoId=>{
				let itoRoster=await ITO.getITORoster(year, month,itoList[itoId]);	
				rosterList[itoId]=itoRoster;
				console.log(itoList[itoId].itoName,itoRoster)
			});
			console.log(rosterList);
			return rosterList;
		}
	}
}
module.exports = RosterManager;