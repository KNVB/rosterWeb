import {useContext} from 'react';
import RosterSchedulerRow from './RosterSchedulerRow';
import RosterWebContext from '../../../../RosterWebContext';
export default function SchedulerTableBody(props){
    let {rosterData} = useContext(RosterWebContext);
    let schedulerRowList = [];
    //console.log(rosterData);
    
    Object.keys(rosterData.rosterList).forEach(itoId=>{
        schedulerRowList.push(<RosterSchedulerRow itoId={itoId} key={itoId+"_roster"}/>);
    })
    
    return (
        <tbody>
          {schedulerRowList}
        </tbody>
    );
}