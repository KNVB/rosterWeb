class RosterManager
{
	constructor(sp){
		let DBO=require("../utils/dbo.js");
		let ITOYearlyRosterStatistic=require('./rosterStatistic/ITOYearlyStatistic');
		let MonthlyStatistic =require('./rosterStatistic/MonthlyStatistic');
		let Shift =require('./Shift');
		let systemParam=sp;
		this.exportExcel=(genExcelData)=>{
			let ExcelExporter=require('./ExcelExporter');
            let excelExporter=new ExcelExporter();
            excelExporter.monthlyCalendar=genExcelData.monthlyCalendar
            excelExporter.rosterList=genExcelData.rosterList;
            excelExporter.vacantShiftList=genExcelData.vacantShiftList
            excelExporter.rosterMonth=genExcelData.rosterMonth;
            excelExporter.rosterYear=genExcelData.rosterYear;
			excelExporter.shiftInfoList=genExcelData.shiftInfoList;
			return excelExporter.doExport('./output.xlsx');
		}
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
			let rosterList={};
			try{
				console.log("Get ("+year+","+month+") Roster List successfully!");
				let results=await dboObj.getRosterList(year,month);
				results.forEach(record=>{
					if (rosterList[record.ito_id]===undefined){
						rosterList[record.ito_id]={
							itoName:record.ito_name,
							itoPostName:record.post_name,
							availableShiftList:record.available_shift.split(","),
							workingHourPerDay:parseFloat(record.working_hour_per_day),
						};
						if (record.balance){
							rosterList[record.ito_id].lastMonthBalance=parseFloat(record.balance);
						}
					}
					if (record.d){
						if (rosterList[record.ito_id].shiftList){
							if (rosterList[record.ito_id].shiftList[record.d]){
								rosterList[record.ito_id].shiftList[record.d]+="+"+record.shift;
							}else {
								rosterList[record.ito_id].shiftList[record.d]=record.shift;
							}
						}else {
							rosterList[record.ito_id].shiftList={};
							rosterList[record.ito_id].shiftList[record.d]=record.shift;
						}
					}
				});
				return itoRosterList;
			} 
			catch (error){
				console.log("Something wrong when getting ("+year+","+month+") roster list:"+error.stack);
				console.log(rosterList);
			}
			finally{
				dboObj.close();
			};	
		}
		this.getRosterSchedulerList=async (year,month)=>{
			let finalResult={};
			let dboObj=new DBO();
			try{
				let finalResult=await this.getRosterList(year,month);
				let results=await dboObj.getPreivousMonthShiftList(year,month,systemParam);
				results.forEach(result=>{
					if (finalResult[result.ito_id].previousMonthShiftList===undefined){
						finalResult[result.ito_id].previousMonthShiftList=[];
					}
					finalResult[result.ito_id].previousMonthShiftList.push(result.shift);
				});
				results=await dboObj.getPreferredShiftList(year,month);
				results.forEach(result=>{
					if (finalResult[result.ito_id].preferredShiftList===undefined){
						finalResult[result.ito_id].preferredShiftList={};
					}
					finalResult[result.ito_id].preferredShiftList[result.d]=result.preferred_shift;
				});
				return finalResult;
			}
			catch (error){
				console.log("Something wrong when getting ("+year+","+month+") roster scheduler list:"+error.stack);				
			}
			finally{
				dboObj.close();
			};
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
            let itoRosterList=rosterData.rosterData;
            let year=rosterData.year;
            /*
			console.log(year+"/"+month);
            console.log("preferredShiftList="+JSON.stringify(preferredShiftList));
            console.log("rosterList="+JSON.stringify(rosterList));
			*/
			let dboObj=new DBO();
			try{
				let result=await dboObj.saveRosterData(year,month,itoRosterList);
				return result;
			}catch(err){
				console.log("Some wrong when update roster data:"+err);
				throw new Error("Some wrong when update roster data.");
			}
			finally{
				dboObj.close();
			};
		} 
	}
}
module.exports = RosterManager;