import {useContext} from 'react';
import Roster from '../../../../utils/Roster';
import RosterWebContext from '../../../../utils/RosterWebContext';

export default function ClearAllShiftDataButton(){
    //let {activeShiftInfoList,monthlyCalendar,rosterData,setRosterData} = useContext(RosterWebContext);
    let [contextValue,updateContext]=useContext(RosterWebContext);
    function clearAllShiftData(){
        let temp=JSON.parse(JSON.stringify(contextValue.undoableRosterSchedulerList.presentValue));
        Object.keys(temp.rosterList).forEach(itoId=>{
            temp.rosterList[itoId].shiftList={};
        });
        contextValue.undoableRosterSchedulerList.set(temp);
        updateContext({type:'updateRoster',value:contextValue.undoableRosterSchedulerList});
    }
    return(
        <div className="clearAllButton" onClick={clearAllShiftData}>
            Clear All Shift Data
        </div>
    )
}