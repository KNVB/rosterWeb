import fetchApi from './fetch';
class Roster{
    constructor(){
        this.get=(year,month)=>{
            fetchApi('/getRosterList','GET',{"year":year,"month":month})
                    .then(x=>{
                        console.log(x);
                    })
                    .catch(err => {
                        alert("Something wrong when getting roster data: "+err.message);
                    });
        }
    }
}
export default Roster;