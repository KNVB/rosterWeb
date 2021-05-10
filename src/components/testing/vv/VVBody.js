import {useContext,useCallback,useEffect} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import VVRow from './VVRow';
import useKeyBoard from './useKeyBoard';
export default function VVBody(props){
    let rowList=[];
    let {undoableRosterList,selectedRegionUtil,updateContext}=useContext(RosterWebContext);
    useKeyBoard(selectedRegionUtil,updateContext,undoableRosterList);
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
    if (undoableRosterList){
        let headerRowCount=0;
        if (document.getElementById("rosterTable").tHead){
            headerRowCount=document.getElementById("rosterTable").tHead.children.length;
        }
        Object.keys(undoableRosterList.presentValue.rosterList).forEach(itoId=>{
            rowList.push(
                <VVRow key={itoId} itoId={itoId} rowIndex={rowList.length+headerRowCount}/>
            )
        });        
    }
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}