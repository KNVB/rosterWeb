import { useContext } from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import UndoRow from './UndoRow';
export default function UndoBody(props){
    let {rosterList}=useContext(RosterWebContext);
    let rowList=[];
    //console.log(Object.keys(rosterList.present["ITO1_1999-01-01"].shiftList).length);
    if (rosterList){
        Object.keys(rosterList.present).forEach(itoId=>{
            rowList.push(<UndoRow itoId={itoId} key={itoId+"_roster"} rowIndex={rowList.length}/>);
        });
    }   
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}