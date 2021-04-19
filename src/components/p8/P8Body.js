import {useContext} from 'react';
import RosterRow from './RosterRow';
import RosterWebContext from '../../utils/RosterWebContext';
export default function P8Body(props){
    let rowList=[];
    let {rosterData,monthlyCalendar}=useContext(RosterWebContext);
    if ((rosterData) && (monthlyCalendar)){
        Object.keys(rosterData).forEach(itoId=>{
            rowList.push(                    
                <RosterRow 
                    itoId={itoId}
                    key={itoId+"_roster"}                    
                    rowIndex={rowList.length+3}/>
            )
        });
    }
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}