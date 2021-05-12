import {useCallback,useContext,useEffect} from 'react';
import PreferredShiftRow from './PreferredShiftRow';
import RosterSchedulerRow from './RosterSchedulerRow';
import RosterWebContext from '../../../utils/RosterWebContext';
import useKeyBoard from './useKeyBoard';
export default function RosterSchedulerBody(props){
    let rowList=[];
    let [contextValue, updateContext]=useContext(RosterWebContext);
    useKeyBoard(contextValue.selectedRegionUtil,updateContext,contextValue.undoableRosterSchedulerList);
    let mouseUp=useCallback((e)=>{
        console.log("mouse up");
        if (contextValue.selectedRegionUtil.inSelectMode()){
            contextValue.selectedRegionUtil.endSelect();
            updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
        }
    },[contextValue.selectedRegionUtil,updateContext]);
    useEffect(()=>{
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp]);
    let headerRowCount=3;
    //    headerRowCount=document.getElementById("rosterTable").tHead.children.length;
        //console.log(undoableRosterSchedulerList.presentValue);       
    Object.keys(contextValue.undoableRosterSchedulerList.presentValue.rosterList).forEach(itoId=>{
        rowList.push(
            <RosterSchedulerRow key={itoId+'_shiftList'} itoId={itoId} rowIndex={rowList.length+headerRowCount}/>
        )
        rowList.push(
            <PreferredShiftRow key={itoId+'_preferred_shiftList'} itoId={itoId} rowIndex={rowList.length+headerRowCount}/>
        )
    });
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}