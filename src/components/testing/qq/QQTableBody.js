import {useContext} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import QQRow from './QQRow';
export default function QQTableBody(props){
    let {rosterData}=useContext(RosterWebContext);
    let rowList=[];

    Object.keys(rosterData).forEach(itoId=>{
        rowList.push(<QQRow key={itoId+"_roster"} itoId={itoId} rowIndex={rowList.length+1}/>);
    });
    
    return(
        <tbody>
           {rowList}
        </tbody>
    )
}