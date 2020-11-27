class RosterManager
{
	constructor(){
		let DBO=require("../utils/dbo.js");
		let ITO=require("./ITO.js");
		const RosterRule = require('./RosterRule');
		this.getRosterList=async (year,month)=>{
			try{
				let itoList=await ITO.getITOList(year,month);
				let itoIdList=Object.keys(itoList);
				console.log(RosterRule);
				/*
				let dboObj=new DBO();
				let rosterList=dboObj.getRosterList(year,month,itoIdList);
				return rosterList;
				*/
			} catch (error){
				console.log("Something wrong when getting roster list:"+error);
			}
			
		}
	}
}
module.exports = RosterManager;