import Utility from './Utility';
class Roster{
    constructor(){
        this.get=(year,month)=>{
           return Utility.fetchAPI('/publicAPI/getITORosterList','GET',{"year":year,"month":month})                   
        }
        this.getRosterParam=()=>{
            return Utility.fetchAPI('/publicAPI/getRosterParam','GET');
        }
    }
}
export default Roster;