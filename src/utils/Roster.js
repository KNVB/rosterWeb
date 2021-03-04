import Utility from './Utility';
export default class Roster{
    constructor(){
        this.get=(year,month)=>{
           return Utility.fetchAPI('/publicAPI/getITORosterList','GET',{"year":year,"month":month});
        }
        this.getAllActiveShiftInfo=()=>{
            return Utility.fetchAPI('/publicAPI/getAllActiveShiftInfo','GET');
        }
        this.getRosterSchedulerList=(year,month)=>{
            return Utility.fetchAPI('/privateAPI/getRosterSchedulerList','POST',{"year":year,"month":month});
        }
        this.getYearlyRosterStatistic=(year,month)=>{
            return Utility.fetchAPI('/privateAPI/getYearlyRosterStatistic','POST',{"year":year,"month":month});
        }
    }
}