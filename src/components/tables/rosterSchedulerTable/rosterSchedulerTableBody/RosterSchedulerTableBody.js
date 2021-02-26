import {useContext} from 'react';
import PreferredShiftRow from './PreferredShiftRow';
import RosterSchedulerRow from './RosterSchedulerRow';
import RosterWebContext from '../../../../RosterWebContext';
import VacantShiftRow from './VacantShiftRow';

export default function RosterSchedulerTableBody(props){
    let rowList = [];
    let {rosterData}=useContext(RosterWebContext);
    
    Object.keys(rosterData.rosterList).forEach(itoId=>{
        rowList.push(<RosterSchedulerRow key={itoId+"_roster_scheduler_row"} itoId={itoId}/>);
        rowList.push(<PreferredShiftRow key={itoId+"_preferred_shift_row"} itoId={itoId}/>);
    });
 
    rowList.push(<VacantShiftRow key="vacant_shift_row"/>);
   
    return (
        <tbody>          
            {rowList}
        </tbody>
    );
}