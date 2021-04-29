import { useContext } from 'react';
import RedoRow from './RedoRow';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function RedoBody(props){
    let {rosterList}=useContext(RosterWebContext);
    let rowList=[];
    //console.log(Object.keys(rosterList.present["ITO1_1999-01-01"].shiftList).length);
    if (rosterList){
        Object.keys(rosterList.present).forEach(itoId=>{
            rowList.push(<RedoRow itoId={itoId} key={itoId+"_roster"} rowIndex={rowList.length+3}/>);
        });
    }   
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}