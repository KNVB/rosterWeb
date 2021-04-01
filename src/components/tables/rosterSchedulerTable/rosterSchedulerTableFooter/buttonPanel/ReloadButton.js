import {useContext} from 'react';
import RosterWebContext from '../../../../../utils/RosterWebContext';
export default function ReloadButton(){
    let {orgRosterData,setRosterData} = useContext(RosterWebContext);
    async function reload(){
        /*
        console.log(orgRosterData.rosterList['ITO1_1999-01-01'].shiftList);
        console.log(rosterData.rosterList['ITO1_1999-01-01'].shiftList);
        */
        sessionStorage.setItem("rosterData",JSON.stringify(orgRosterData));
        setRosterData(orgRosterData);
    }
    return (
        <div className="reloadRoster" onClick={reload}>
            Reload the roster
        </div>
    );    
}