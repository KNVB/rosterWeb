import ITO from './ITO';
import Roster from '../../utils/Roster';
import SessionExpiredError from '../../utils/SessionExpiredError';
import Utility from '../../utils/Utility';
export default class AdminUtility extends Roster{
    constructor(changeLoggedInFlag){
        super(changeLoggedInFlag);
        let privateAPIPath='/publicAPI';
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
        this.getITOList=async(year,month)=>{
            try{
                let itoObj;
                let result=await Utility.fetchAPI(privateAPIPath+'/getITOList','POST',{"year":year,"month":month});
                let resultList={};
                Object.keys(result).forEach(itoId=>{
                    itoObj=new ITO();
                    itoObj.itoId=itoId;
                    itoObj.itoName=result[itoId].ito_name;
                    itoObj.postName=result[itoId].post_name;
                    itoObj.workingHourPerDay=parseFloat(result[itoId].workingHourPerDay.toFixed(2));
                    itoObj.joinDate=new Date(result[itoId].join_date);
                    itoObj.leaveDate=new Date(result[itoId].leave_date);
                    itoObj.availableShiftList=result[itoId].availableShiftList;
                    itoObj.blackListedShiftPatternList=result[itoId].blackListedShiftPatternList;
                    resultList[itoId]=itoObj;
                });
                return resultList;
            }catch(error){
                if (error instanceof SessionExpiredError){
                    console.log("changeLoggedInFlag");
                    changeLoggedInFlag(false);
                } else {
                    throw error;
                }
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
}