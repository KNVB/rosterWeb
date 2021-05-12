import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import RosterViewerRow from './RosterViewerRow';
export default function RosterViewerBody(props){
    let rowList=[];
    let [contextValue, updateContext]=useContext(RosterWebContext);

    let headerRowCount=3;
    Object.keys(contextValue.rosterList).forEach(itoId=>{
        rowList.push(
            <RosterViewerRow key={itoId} itoId={itoId} rowIndex={rowList.length+headerRowCount}/>
        )
    });
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}