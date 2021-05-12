import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function ReloadButton(){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    async function reload(){
        while (contextValue.undoableRosterSchedulerList.canUndo()){
            contextValue.undoableRosterSchedulerList.undo();
        }
        updateContext({type:'updateRoster',value:contextValue.undoableRosterSchedulerList})
    }
    return (
        <div className="reloadRoster" onClick={reload}>
            Reload the roster
        </div>
    );    
}