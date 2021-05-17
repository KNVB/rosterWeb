import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';

export default function ClearAllShiftDataButton(){
    //let {activeShiftInfoList,monthlyCalendar,rosterData,setRosterData} = useContext(RosterWebContext);
    let [contextValue,updateContext]=useContext(RosterWebContext);
    function clearAllShiftData(){
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        Object.keys(temp).forEach(itoId=>{
            temp[itoId].rosterList.shiftList={};
        });
        contextValue.rosterData.set(temp);
        updateContext({type:'updateRosterData',value:contextValue.rosterData});
    }
    return(
        <div className="clearAllButton" onClick={clearAllShiftData}>
            Clear All Shift Data
        </div>
    )
}