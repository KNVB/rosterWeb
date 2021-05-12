import {useContext} from 'react';
import Roster from '../../../../utils/Roster';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function SaveRosterToDBButton(){
    //let {changeLoggedInFlag,rosterData,rosterMonth} = useContext(RosterWebContext);
    let [contextValue,updateContext]=useContext(RosterWebContext);
    async function saveRosterToDB(){
        let roster=new Roster(contextValue.changeLoggedInFlag);
        //console.log(contextValue.undoableRosterSchedulerList.presentValue.rosterList);
        console.log(contextValue.undoableRosterSchedulerList.presentValue.preferredShiftList);
        /*
        roster.saveRosterToDB({
            month:rosterMonth.getMonth()+1,
            preferredShiftList:rosterData.preferredShiftList,
            rosterList:rosterData.rosterList,
            year:rosterMonth.getFullYear(),
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
        */
        roster=null;
    }
    return(
        <div className="saveRosterToDBButton" onClick={saveRosterToDB}>
            Save all data to DB
        </div>
    )
}