import {useEffect, useMemo, useState} from 'react';
import QQRow from './QQRow';
export default function QQTableBody(props){
    let monthlyCalendar=props.rosterTableData.monthlyCalendar;
    let rowList=[];
    
    //const [rosterData,setRosterData]=useState(props.rosterTableData);
    /*
    useMemo(()=>{
        console.log(rosterData.rosterList['ITO1_1999-01-01'].shiftList);
    },[rosterData])
*/    
    //console.log(rosterData.rosterList['ITO1_1999-01-01'].shiftList);
    
    Object.keys(props.rosterTableData.rosterList).forEach(itoId=>{
        let itoRoster=props.rosterTableData.rosterList[itoId];
        rowList.push(<QQRow 
                        itoRoster={itoRoster} 
                        monthlyCalendar={monthlyCalendar}
                        setHightLightCellIndex={props.setHightLightCellIndex}
                        setRosterTableData={props.setRosterTableData}/>);
    });
    
    return(
        <tbody>
           {rowList}
        </tbody>
    )
}