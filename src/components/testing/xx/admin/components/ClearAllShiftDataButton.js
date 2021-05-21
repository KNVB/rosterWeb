import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';

export default function ClearAllShiftDataButton(){
    //let {activeShiftInfoList,monthlyCalendar,rosterData,setRosterData} = useContext(RosterWebContext);
    let [contextValue,updateContext]=useContext(RosterWebContext);
    function clearAllShiftData(){
        let temp=JSON.parse(JSON.stringify(contextValue.itoRosterList.presentValue));
        Object.keys(temp).forEach(itoId=>{
            temp[itoId].shiftList={};
        });
        contextValue.itoRosterList.set(temp);
        updateContext({type:'updateRosterData',value:contextValue.itoRosterList});
    }
    return(
        <div className="clearAllButton" onClick={clearAllShiftData}>
            Clear All Shift Data
        </div>
    )
}