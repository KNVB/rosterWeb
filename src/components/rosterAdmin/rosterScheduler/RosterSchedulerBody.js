import {useContext} from 'react';
import RosterSchedulerRow from './RosterSchedulerRow';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function RosterSchedulerBody(props){
    let rowList=[];
    let {undoableRosterSchedulerList}=useContext(RosterWebContext);
    if (undoableRosterSchedulerList){
        let headerRowCount=0;
        if (document.getElementById("rosterTable").tHead){
            headerRowCount=document.getElementById("rosterTable").tHead.children.length;
            Object.keys(undoableRosterSchedulerList.presentValue.rosterList).forEach(itoId=>{
                rowList.push(
                    <RosterSchedulerRow key={itoId} itoId={itoId} rowIndex={rowList.length+headerRowCount}/>
                )
            });
        }
    }
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}