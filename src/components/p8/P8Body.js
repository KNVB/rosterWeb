import {useContext} from 'react';
import RosterRow from './RosterRow';
import RosterWebContext from '../../utils/RosterWebContext';
export default function P8Body(props){
    let rowList=[];
    let {rosterData}=useContext(RosterWebContext);
    if (rosterData){
        Object.keys(rosterData).forEach(itoId=>{
            let roster=rosterData[itoId];
            rowList.push(                    
                <RosterRow 
                    itoId={itoId}
                    key={itoId+"_roster"}
                    roster={roster}
                    rowIndex={rowList.length+3}/>
            )
        });
    }
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}