import {useContext} from 'react';
import RosterRow from './RosterRow';
import RosterWebContext from '../../../../RosterWebContext';
export default function TableBody(props){
    let {rosterList} = useContext(RosterWebContext);
    let rowList = [];
    Object.keys(rosterList).forEach(itoId=>{
       rowList.push(<RosterRow key={itoId+"_roster"} itoId={itoId} noOfPrevDate={props.noOfPrevDate}/>);
    })
    return (
        <tbody>
          {rowList}
        </tbody>
    );
}