import {useContext} from 'react';
import PreferredShiftRow from './PreferredShiftRow';
import RosterSchedulerRow from './RosterSchedulerRow';
import RosterWebContext from '../../../../RosterWebContext';
import VacantShiftRow from './VacantShiftRow';
import Utility from '../../../../utils/Utility';
export default function RosterSchedulerTableBody(){
    let rowList = [];
    let {activeShiftInfoList,monthlyCalendar,rosterData}=useContext(RosterWebContext);
    
    //console.log("RosterSchedulerTableBody");
    //console.log(rosterData);
    let vacantShiftList=Utility.getVacantShiftList(activeShiftInfoList.essentialShift,monthlyCalendar,rosterData.rosterList);
    
    Object.keys(rosterData.rosterList).forEach(itoId=>{
        rowList.push(<RosterSchedulerRow key={itoId+"_roster_scheduler_row"} itoId={itoId}/>);
        rowList.push(<PreferredShiftRow key={itoId+"_preferred_shift_row"} itoId={itoId}/>);
    });    
    rowList.push(<VacantShiftRow key="vacant_shift_row" vacantShiftList={vacantShiftList}/>);

    return (
        <tbody>          
            {rowList}
        </tbody>
    );
}