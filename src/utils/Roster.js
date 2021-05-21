import Utility from './Utility';
export default class Roster{
  constructor(changeLoggedInFlag){
    let publicAPIPath='/publicAPI';
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
    this.getSystemParam=async()=>{
      try{
        let result=await Utility.fetchAPI(publicAPIPath+'/getSystemParam','GET');
        return result;
      }catch (error){
        throw error;
      }          
    }
  }
}