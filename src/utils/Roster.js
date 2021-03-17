import Utility from './Utility';
import SessionExpiredError from './SessionExpiredError';
export default class Roster{
    constructor(changeLoggedInFlag){
        //this.changeLoggedInFlag=changeLoggedInFlag;
        this.exportExcel=async(rosterData)=>{
            try{
                let result=await Utility.fetchAPI('/privateAPI/exportExcel','POST',rosterData);
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
        this.get=(year,month)=>{
           return Utility.fetchAPI('/publicAPI/getITORosterList','GET',{"year":year,"month":month});
        }
        this.getAllActiveShiftInfo=()=>{
            return Utility.fetchAPI('/publicAPI/getAllActiveShiftInfo','GET');
        }
        this.getRosterSchedulerList=async(year,month)=>{
            try{
                let result=await Utility.fetchAPI('/privateAPI/getRosterSchedulerList','POST',{"year":year,"month":month});
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
        this.getYearlyRosterStatistic=async(year,month)=>{
            try{
                let result=await Utility.fetchAPI('/privateAPI/getYearlyRosterStatistic','POST',{"year":year,"month":month});
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
                let result=await Utility.fetchAPI('/privateAPI/saveRosterToDB','POST',rosterData);
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
}