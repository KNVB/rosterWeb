import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function ReloadButton(){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    async function reload(){
        while (contextValue.rosterData.canUndo()){
            contextValue.rosterData.undo();
        }
        updateContext({type:'updateRosterData',value:contextValue.rosterData})
    }
    return (
        <div className="reloadRoster" onClick={reload}>
            Reload the roster
        </div>
    );    
}