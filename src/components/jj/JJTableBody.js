import {useCallback,useContext,useEffect, useState} from 'react';
import JJRow from './JJRow';
import RosterWebContext from '../../utils/RosterWebContext';
export default function JJTableBody(props){
    let rowList = [];
    let {activeShiftInfoList,monthlyCalendar,itoRosterList,systemParam}=useContext(RosterWebContext);
    Object.keys(itoRosterList).forEach(itoId=>{
        rowList.push(<JJRow key={itoId+"_roster_scheduler_row"} itoId={itoId} rowIndex={rowList.length+systemParam.noOfPrevDate}/>);
    })
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}