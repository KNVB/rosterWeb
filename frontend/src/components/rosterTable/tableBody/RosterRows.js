import { useEffect,useState} from 'react';
import Roster from '../../../utils/roster';

function RosterRows(props){
    const [rosterList,setRosterList]=useState({});
    const getData=async ()=>{
        let roster=new Roster();
        let rosterData=await roster.get(props.rosterYear,props.rosterMonth);
        setRosterList(rosterData);
    }
    useEffect(()=>{
        getData();
        console.log(Object.keys(rosterList));
    },[]);
    
    return(
        <tr><td></td></tr>
    );
}
export default RosterRows