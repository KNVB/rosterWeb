import {useContext} from 'react';
import UnreRosterRow from './UnreRosterRow';
import RosterWebContext from '../../utils/RosterWebContext';
export default function UnreTableBody(props){
    let {rosterList} = useContext(RosterWebContext);
    let rowList = [];
    
    Object.keys(rosterList).forEach(itoId=>{
      rowList.push(<UnreRosterRow key={itoId+"_roster"} itoId={itoId}/>);
    })
    return (
        <tbody>
          {rowList}
        </tbody>
    );
}