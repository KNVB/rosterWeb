import {useContext, useEffect} from 'react';
import UnreRosterRow from './UnreRosterRow';
import RosterWebContext from '../../utils/RosterWebContext';
export default function UnreTableBody(props){
    //let {rosterList} = useContext(RosterWebContext);
    let rowList = [];
    //console.log(rosterList);
    /*
    Object.keys(rosterList.present).forEach(itoId=>{
      rowList.push(<UnreRosterRow key={itoId+"_roster"} itoId={itoId}/>);
    })
    */
    useEffect(()=>{

    },
    [useContext(RosterWebContext)]);
    return (
        <tbody>
          {rowList}
        </tbody>
    );
}