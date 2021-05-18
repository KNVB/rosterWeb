import {useContext} from 'react';
import Roster from '../../../../utils/Roster';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function SaveRosterToDBButton(){
    //let {changeLoggedInFlag,rosterData,rosterMonth} = useContext(RosterWebContext);
    let [contextValue]=useContext(RosterWebContext);
    async function saveRosterToDB(){
        let roster=new Roster(contextValue.changeLoggedInFlag);
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        Object.keys(temp).forEach(itoId=>{
            delete temp[itoId].rosterList.availableShiftList;
            delete temp[itoId].rosterList.itoName;
            delete temp[itoId].rosterList.itoPostName;
            delete temp[itoId].rosterList.workingHourPerDay;
        })
        roster.saveRosterToDB({
            rosterData:temp,
            month:contextValue.rosterMonth.getMonth()+1,
            year:contextValue.rosterMonth.getFullYear()
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
        //console.log(contextValue.undoableRosterSchedulerList.presentValue.rosterList);
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