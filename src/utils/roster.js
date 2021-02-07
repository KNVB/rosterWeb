import Utility from './Utility';
class Roster{
    constructor(){
        this.get=(year,month)=>{
           return Utility.fetchAPI('/publicAPI/getITORosterList','GET',{"year":year,"month":month})                   
        }
        this.getAllActiveShiftInfo=()=>{
            return Utility.fetchAPI('/publicAPI/getAllActiveShiftInfo','GET');
        }
        this.getRosterParam=()=>{
            return Utility.fetchAPI('/publicAPI/getRosterParam','GET');
        }
    }
}
export default Roster;