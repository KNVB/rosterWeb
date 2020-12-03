import fetchApi from './fetch';
class Roster{
    constructor(){
        this.get=(year,month)=>{
           return fetchApi('/getITORosterList','GET',{"year":year,"month":month})                   
        }
        this.getRosterRule=()=>{
            return fetchApi('/getRosterRule','GET');
        }
    }
}
export default Roster;