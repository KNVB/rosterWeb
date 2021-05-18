import Utility from './Utility';
import SessionExpiredError from './SessionExpiredError';
export default class Roster{
    constructor(changeLoggedInFlag){
        //this.changeLoggedInFlag=changeLoggedInFlag;
        let privateAPIPath='/publicAPI';
        //let privateAPIPath='/privateAPI';
        let publicAPIPath='/publicAPI';
        this.exportExcel=async(genExcelData)=>{
            try{
                let result=await Utility.fetchAPI(privateAPIPath+'/exportExcel','POST',genExcelData);
                return result;
            }catch(error){
                if (error instanceof SessionExpiredError){
                    console.log("changeLoggedInFlag");
                    changeLoggedInFlag(false);
                } else {
                    throw error;
                }
            }
        }
        this.get=async(year,month)=>{
          try{
            let result=await Utility.fetchAPI(publicAPIPath+'/getITORosterList','GET',{"year":year,"month":month});
            return result;
          } catch (error){
            throw error;
          }
        }
        this.getAllActiveShiftInfo=async()=>{
          try{
            let result=await Utility.fetchAPI(publicAPIPath+'/getAllActiveShiftInfo','GET');
            return result;
          }catch (error){
            throw error;
          }
        }
        this.getRosterSchedulerList=async(year,month)=>{
            try{
                let result=await Utility.fetchAPI(privateAPIPath+'/getRosterSchedulerList','POST',{"year":year,"month":month});
                return result;
            }catch(error){
                if (error instanceof SessionExpiredError){
                    console.log("changeLoggedInFlag");
                    changeLoggedInFlag(false);
                } else {
                    throw error;
                }
            }
        }
        this.getSystemParam=async()=>{
          try{
            let result=await Utility.fetchAPI(publicAPIPath+'/getSystemParam','GET');
            return result;
          }catch (error){
            throw error;
          }          
        }
        this.getYearlyRosterStatistic=async(year,month)=>{
            try{
                let result=await Utility.fetchAPI(privateAPIPath+'/getYearlyRosterStatistic','POST',{"year":year,"month":month});
                return result;
            }catch(error){
                if (error instanceof SessionExpiredError){
                    console.log("changeLoggedInFlag");
                    changeLoggedInFlag(false);
                }
                throw error;
            }            
        }
        this.saveRosterToDB=async(rosterData)=>{
            try{
                let result=await Utility.fetchAPI(privateAPIPath+'/saveRosterToDB','POST',rosterData);
                return result;
            }catch (error){
                if (error instanceof SessionExpiredError){
                    console.log("changeLoggedInFlag");
                    changeLoggedInFlag(false);
                }
                throw error;
            }
        }
    }
    static getDuplicateShiftList(monthlyCalendar,rosterList){
      let result={};
      Object.keys(rosterList).forEach(itoId => {
        result[itoId]=[];
      });
      for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
        let tempResult=[];
        Object.keys(rosterList).forEach(itoId => {
          let roster = rosterList[itoId];
          if (roster.shiftList[i+1]){
            let shiftTypeList = roster.shiftList[i+1].split("+");
            shiftTypeList.forEach(shiftType => {
              if (roster.availableShiftList.includes(shiftType)){
                switch (shiftType){
                  case "a" :                 
                  case "c" :if (tempResult.includes(shiftType)){
                              result[itoId].push(i+1);
                            } else {
                              tempResult.push(shiftType);
                            }
                            break;
                  case "b" :
                  case "b1":if (tempResult.includes("b")){
                              result[itoId].push(i+1);
                            }else {
                              tempResult.push('b');
                            }
                            break;      
                  default:break;          
                }
              }  
            }); 
          }
        });
      }
      return result;
    }
    static getVacantShiftList(essentialShift,monthlyCalendar,rosterList){
        let result={};
        for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
          let vacantShift = essentialShift;
          Object.keys(rosterList).forEach(itoId => {
            let roster = rosterList[itoId];
            if (roster.shiftList[i+1]){
              let shiftTypeList = roster.shiftList[i+1].split("+");
              shiftTypeList.forEach(shiftType => {
                if (roster.availableShiftList.includes(shiftType)){
                  if (shiftType === "b1") {
                    vacantShift = vacantShift.replace("b", "");
                  } else {
                    vacantShift = vacantShift.replace(shiftType, "");
                  }
                }
              });
            }
          });
          result[i]=vacantShift;
        }
        return result;
    } 
    static updateThisMonthBalance(rosterData,itoId){
        let roster=rosterData.rosterList[itoId];
        roster.thisMonthBalance=roster.thisMonthHourTotal+roster.lastMonthBalance;
        rosterData.rosterList[itoId]=roster;
    }
    
}