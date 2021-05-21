import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
export default function ReloadButton(){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    async function reload(){
        while (contextValue.itoRosterList.canUndo()){
            contextValue.itoRosterList.undo();
        }
        updateContext({type:'updateRosterData',value:contextValue.itoRosterList})
    }
    return (
        <div className="reloadRoster" onClick={reload}>
            Reload the roster
        </div>
    );    
}