import {useContext,useEffect,useState} from 'react';
import PreferredShiftRow from './PreferredShiftRow';
import RosterSchedulerRow from './RosterSchedulerRow';
import RosterWebContext from '../../../../RosterWebContext';
import VacantShiftRow from './VacantShiftRow';
export default function RosterSchedulerTableBody(){
    let {rosterData} = useContext(RosterWebContext);
    const[rosterInfo,setRosterInfo]=useState(rosterData);

    let rowList = [];
    useEffect(()=>{
        setRosterInfo(rosterData);
    },rosterData)

    if (rosterInfo){
        console.log("data:"+rosterData.rosterList['ITO1_1999-01-01'].shiftList.length);
        console.log("dataInfo:"+rosterInfo.rosterList['ITO1_1999-01-01'].shiftList.length);
    }
    Object.keys(rosterData.rosterList).forEach(itoId=>{
       rowList.push(<RosterSchedulerRow key={itoId+"_roster_scheduler_row"} itoId={itoId}/>);
       rowList.push(<PreferredShiftRow key={itoId+"_preferred_shift_row"} itoId={itoId}/>);
    })
    
    rowList.push(<VacantShiftRow key="vacant_shift_row"/>);
    return (
        <tbody>            
            {rowList}
        </tbody>
    );
}