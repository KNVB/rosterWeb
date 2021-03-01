import {useContext} from 'react';
import RosterRow from './RosterRow';
import RosterWebContext from '../../../../RosterWebContext';
export default function TableBody(props){
    let {rosterData} = useContext(RosterWebContext);
    let rowList = [];
    
    Object.keys(rosterData).forEach(itoId=>{
       rowList.push(<RosterRow key={itoId+"_roster"} itoId={itoId} noOfPrevDate={props.noOfPrevDate}/>);
    })
    return (
        <tbody>
          {rowList}
        </tbody>
    );
}