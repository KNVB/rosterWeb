import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import ViewerRow from './ViewerRow';

export default function ViewerBody(props){
    let rowList=[],headerRowCount=3;
    let [contextValue]=useContext(RosterWebContext);
    console.log(contextValue.itoRosterList);
    Object.keys(contextValue.itoRosterList).forEach(itoId=>{
        rowList.push(
            <ViewerRow 
                itoId={itoId}
                key={itoId+'_shiftList'}
                rowIndex={rowList.length+headerRowCount}/>
        )
    })
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}