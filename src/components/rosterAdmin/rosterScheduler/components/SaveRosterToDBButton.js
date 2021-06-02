import {useContext} from 'react';
import AdminUtility from '../utils/AdminUtility';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function SaveRosterToDBButton(){
    let [contextValue]=useContext(RosterWebContext);
    async function saveRosterToDB(){
        let adminUtility=new AdminUtility(contextValue.changeLoggedInFlag);
        let rosterData={};
        for (const [itoId, itoRoster] of Object.entries(contextValue.itoRosterList.presentValue)) {
            rosterData[itoId]={
                shiftList:itoRoster.shiftList,
                preferredShiftList:itoRoster.preferredShiftList,
                lastMonthBalance:itoRoster.lastMonthBalance,
                thisMonthBalance:itoRoster.thisMonthBalance
            }
        }
        adminUtility.saveRosterToDB({
            month:contextValue.rosterMonth.getMonth()+1,
            preferredShiftList:rosterData.preferredShiftList,
            rosterList:rosterData,
            year:contextValue.rosterMonth.getFullYear(),
        })
        .then(updateResult=>{
            if (updateResult.result){
                alert("Update Success");
            } else {
                console.log(updateResult);
            }
        })
        .catch(error=>{
            alert(error.message);
        });
        adminUtility=null;
    }
    return(
        <div className="saveRosterToDBButton" onClick={saveRosterToDB}>
            Save all data to DB
        </div>
    )
}