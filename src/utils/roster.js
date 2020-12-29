import Utility from './Utility';
class Roster{
    constructor(){
        this.get=(year,month)=>{
           return Utility.fetchAPI('/publicAPI/getITORosterList','GET',{"year":year,"month":month})                   
        }
        this.getRosterRule=()=>{
            return Utility.fetchAPI('/publicAPI/getRosterRule','GET');
        }
    }
}
export default Roster;