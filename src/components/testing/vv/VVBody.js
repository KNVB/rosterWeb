import {useContext,useCallback,useEffect} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import VVRow from './VVRow';
export default function VVBody(props){
    let rowList=[];
    let {undoableRosterList,selectedRegionUtil,updateContext}=useContext(RosterWebContext);
    let keyDown=useCallback((e)=>{
        console.log("keyDown");
        if (e.ctrlKey){
            //console.log(e.which);
            switch (e.which){
                case 89: //Handle Ctrl-Y
                    e.preventDefault();
                    console.log("VVBody.futureValue.length="+undoableRosterList.futureValue.length);
                    console.log("VVBody.redo="+undoableRosterList.canRedo());
                    if (undoableRosterList.canRedo()){
                        undoableRosterList.redo();
                        updateContext({type:'updateRoster',value:undoableRosterList});
                    }
                    break;
                case 90: //Handle Ctrl-Z
                    e.preventDefault();
                    console.log("VVBody.pastValue.length="+undoableRosterList.pastValue.length);
                    console.log("VVBody.undo="+undoableRosterList.canUndo());
                    if (undoableRosterList.canUndo()){
                        undoableRosterList.undo();
                        updateContext({type:'updateRoster',value:undoableRosterList});
                    }
                    break;
                default:break;    
            }
        } else {
            switch (e.which){
                case 27://handle "Esc" key event
                    selectedRegionUtil.clearCopiedRegion();
                    break;
                case 37://handle left arrow key event
                    selectedRegionUtil.selectNextCell(e,-1,0);
                    break;
                case 38://handle up arrow key event
                    selectedRegionUtil.selectNextCell(e,0,-1);
                    break;
                case 39://handle right arrow key event
                    selectedRegionUtil.selectNextCell(e,1,0);
                    break;			
                case 40://handle down arrow key event
                    selectedRegionUtil.selectNextCell(e,0,1);
                    break;    
                default:break;                 
            }
            updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
        }    
    },[selectedRegionUtil,updateContext,undoableRosterList]);        
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
    useEffect(()=>{
        document.addEventListener('keydown',keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown)
        }
    },[keyDown,selectedRegionUtil,undoableRosterList]);
    if (undoableRosterList){
        let headerRowCount=0;
        if (document.getElementById("rosterTable").tHead){
            headerRowCount=document.getElementById("rosterTable").tHead.children.length;
        }
        Object.keys(undoableRosterList.presentValue).forEach(itoId=>{
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