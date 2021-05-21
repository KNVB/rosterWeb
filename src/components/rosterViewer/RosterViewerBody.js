import {useContext} from 'react';
import RosterViewerRow from './RosterViewerRow';
import RosterWebContext from '../../utils/RosterWebContext';

export default function RosterViewerBody(props){
    let rowList=[],headerRowCount=3;
    let [contextValue]=useContext(RosterWebContext);
    console.log(contextValue.itoRosterList);
    Object.keys(contextValue.itoRosterList).forEach(itoId=>{
        rowList.push(
            <RosterViewerRow 
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