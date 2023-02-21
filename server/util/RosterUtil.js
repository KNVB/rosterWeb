import Dbo from "./Dbo.js";
import Shift from "../classes/Shift.js";
export default class RosterUtil {
    constructor() {
        this.getActiveShiftList=async()=>{
			let dboObj=new Dbo();
			let essentialShift="";
			let shiftInfoList={};
			
			try{
				let results=await dboObj.getActiveShiftList();
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
        this.getRosterList=async (year,month) =>{
            let dbo = new Dbo();
            let itoRosterList={};
            try {                
                let results= await dbo.getRosterList(year,month);
                console.log("Get ("+year+","+month+") Roster List successfully!");
                results.forEach(record=>{
					if (itoRosterList[record.ito_id]===undefined){
						itoRosterList[record.ito_id]={
							availableShiftList:record.available_shift.split(","),
							itoName:record.ito_name,
							itoPostName:record.post_name,
							lastMonthBalance:0.0,
							shiftList:{},
							thisMonthBalance:0.0,
							workingHourPerDay:parseFloat(record.working_hour_per_day)
						}
						if (record.balance){
							itoRosterList[record.ito_id].lastMonthBalance=parseFloat(record.balance);
						}
					}
					if (record.d){
						if (itoRosterList[record.ito_id].shiftList[record.d]===undefined){
							itoRosterList[record.ito_id].shiftList[record.d]=record.shift;
						}else{
							itoRosterList[record.ito_id].shiftList[record.d]+="+"+record.shift;
						}
					}
				});
				return itoRosterList;
            }catch (error) {
                console.log("An error occur when getting roster list from DB.");
                console.log(error);
                throw (error);
            } finally {
                dbo.close();
            }
        }
    }
}