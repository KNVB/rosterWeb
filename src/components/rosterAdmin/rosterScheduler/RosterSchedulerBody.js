import {useCallback,useContext,useEffect} from 'react';
import RosterSchedulerRow from './RosterSchedulerRow';
import RosterWebContext from '../../../utils/RosterWebContext';
import useKeyBoard from './useKeyBoard';
export default function RosterSchedulerBody(props){
    let rowList=[];
    let {selectedRegionUtil,undoableRosterSchedulerList,updateContext}=useContext(RosterWebContext);
    useKeyBoard(selectedRegionUtil,updateContext,undoableRosterSchedulerList);
    let mouseUp=useCallback((e)=>{
        console.log("mouse up");
        selectedRegionUtil.endSelect();
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
    },[selectedRegionUtil,updateContext]);
    useEffect(()=>{
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp]);
    if (undoableRosterSchedulerList){
        let headerRowCount=0;
        if (document.getElementById("rosterTable").tHead){
            headerRowCount=document.getElementById("rosterTable").tHead.children.length;
            //console.log(undoableRosterSchedulerList.presentValue);       
            Object.keys(undoableRosterSchedulerList.presentValue.rosterList).forEach(itoId=>{
                rowList.push(
                    <RosterSchedulerRow key={itoId} itoId={itoId} rowIndex={rowList.length+headerRowCount}/>
                )
            });
            
        }
    }
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}