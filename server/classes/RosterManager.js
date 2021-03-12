class RosterManager
{
	constructor(sp){
		
		let DBO=require("../utils/dbo.js");
		let ITORoster = require('./ITORoster');
		let ITOYearlyRosterStatistic=require('./rosterStatistic/ITOYearlyStatistic');
		let MonthlyStatistic =require('./rosterStatistic/MonthlyStatistic');
		let Shift =require('./Shift');
		let systemParam=sp;
		this.getAllActiveShiftInfo=async()=>{
			let dboObj=new DBO();
			let essentialShift="";
			let shiftInfoList={};
			
			try{
				let results=await dboObj.getAllActiveShiftInfo();
				results.forEach(record=>{
					let shift=new Shift();
					shift.cssClassName=record.css_class_name;
					shift.duration=parseFloat(record.shift_duration);
					shift.isEssential=(record.is_essential === 1);
					shift.timeSlot=record.time_slot;
					shift.type=record.shift_type;
					shiftInfoList[shift.type]=shift;
					if (record.is_essential === 1){
						essentialShift+=shift.type;
					}
				});
				console.log("Get All Active Shift Info. success.");
				shiftInfoList["essentialShift"]=essentialShift;
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
		this.getRosterList=async (year,month)=>{
			let dboObj=new DBO();
			let itoRoster=null;
			let rosterList={};
			try{
				let results=await dboObj.getRosterList(year,month);
				//console.log(results);
				results.forEach(record=>{
					//console.log(record);
					if (rosterList[record.ito_id]===undefined){
						itoRoster=new ITORoster();
						itoRoster.itoName=record.ito_name;
						itoRoster.itoPostName=record.post_name;
						itoRoster.availableShiftList=record.available_shift.split(",");
						itoRoster.workingHourPerDay=parseFloat(record.working_hour_per_day);
						if (record.balance)
							itoRoster.lastMonthBalance=parseFloat(record.balance);
					} else {
						itoRoster=rosterList[record.ito_id];
					}
					if (record.d){
						if (itoRoster.shiftList[record.d]===undefined){
							itoRoster.shiftList[record.d]=record.shift;
						}else{
							itoRoster.shiftList[record.d]+="+"+record.shift;
						}
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
		this.getRosterSchedulerList=async (year,month)=>{
			let finalResult={}
			let preferredShiftList={};
			let previousMonthShiftList={};
			
			let dboObj=new DBO();
			try{
				let results=await dboObj.getPreivousMonthShiftList(year,month,systemParam);
				results.forEach(result=>{
					if (previousMonthShiftList[result.ito_id]===undefined){
						previousMonthShiftList[result.ito_id]=[];
					}
					previousMonthShiftList[result.ito_id].push(result.shift);
				});
				let rosterList=await this.getRosterList(year,month);
				//console.log(rosterList);
				results=await dboObj.getPreferredShiftList(year,month);
				//console.log(results);
				results.forEach(result=>{
					if (preferredShiftList[result.ito_id]===undefined){
						preferredShiftList[result.ito_id]={};
					}
					preferredShiftList[result.ito_id][result.d]=result.preferred_shift;
				});
				//finalResult.itoList=await ITO.getITOList(year, month);
				finalResult.rosterList=rosterList;
				finalResult.preferredShiftList=preferredShiftList;
				finalResult.previousMonthShiftList=previousMonthShiftList;
			}
			catch (error){
				console.log("Something wrong when getting ("+year+","+month+") roster scheduler list:"+error);				
			}
			finally{
				dboObj.close();
			};
			return finalResult;
		}
		this.getYearlyRosterStatistic=async (year, month)=>{
			let dboObj=new DBO();
			let monthlyStatistic=null;
			let yearlyRosterStatistic={};
			try{
				let results=await dboObj.getYearlyRosterStatistic(year,month);
				let itoYearlyRosterStatistic=null;
				results.forEach(record=>{
					if (yearlyRosterStatistic[record.ito_id]===undefined){
						itoYearlyRosterStatistic=new ITOYearlyRosterStatistic();
						itoYearlyRosterStatistic.itoPostName=record.post_name;
					} else {
						itoYearlyRosterStatistic=yearlyRosterStatistic[record.ito_id];
					}
					monthlyStatistic=new MonthlyStatistic();
					monthlyStatistic.aShiftTotal=parseInt(record.a);
					monthlyStatistic.bxShiftTotal=parseInt(record.b);
					monthlyStatistic.cShiftTotal=parseInt(record.c);
					monthlyStatistic.dxShiftTotal=parseInt(record.d);
					monthlyStatistic.oShiftTotal=parseInt(record.o);
					itoYearlyRosterStatistic.itoMonthlyStatisticList.push(monthlyStatistic);
					yearlyRosterStatistic[record.ito_id]=itoYearlyRosterStatistic;
				});
				return yearlyRosterStatistic;
			}
			catch (error){
				console.log("Something wrong when getting ("+year+","+month+") yearly roster statistic:"+error);
				console.log(yearlyRosterStatistic);
			}
			finally{
				dboObj.close();
			};	 	
		}
		this.saveToDB=async (rosterData)=>{
			let month=rosterData.month;
            let preferredShiftList=rosterData.preferredShiftList;
            let rosterList=rosterData.rosterList;
            let year=rosterData.year;
            /*
			console.log(year+"/"+month);
            console.log("preferredShiftList="+JSON.stringify(preferredShiftList));
            console.log("rosterList="+JSON.stringify(rosterList));
			*/
			let dboObj=new DBO();
			try{
				let result=await dboObj.saveRosterData(year,month,preferredShiftList,rosterList);
				return result;
			}catch(err){
				console.log("Some wrong when update roster data:"+err);
				throw "Some wrong when update roster data.";
			}
			finally{
				dboObj.close();
			};
		} 
	}
}
module.exports = RosterManager;