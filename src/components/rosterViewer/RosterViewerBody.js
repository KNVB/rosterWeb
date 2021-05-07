import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import RosterViewerRow from './RosterViewerRow';
export default function RosterViewerBody(props){
    let rowList=[];
    let {rosterList}=useContext(RosterWebContext);
    if (rosterList){
        let headerRowCount=0;
        if (document.getElementById("rosterTable").tHead){
            headerRowCount=document.getElementById("rosterTable").tHead.children.length;
        }
        Object.keys(rosterList).forEach(itoId=>{
            rowList.push(
                <RosterViewerRow key={itoId} itoId={itoId} rowIndex={rowList.length+headerRowCount}/>
            )
        });
    }
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}