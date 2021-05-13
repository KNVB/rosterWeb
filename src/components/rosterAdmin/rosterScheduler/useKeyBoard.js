import {useCallback,useEffect} from 'react';
export default function useKeyBoard(selectedRegionUtil,updateContext,undoableRosterList){
	let keyDown=useCallback((e)=>{
        console.log("keyDown");
        if (e.ctrlKey){
            //console.log(e.which);
            switch (e.which){
                case 89: //Handle Ctrl-Y
                    e.preventDefault();
                    console.log("RosterSchedulerBody.futureValue.length="+undoableRosterList.futureValue.length);
                    console.log("RosterSchedulerBody:redo,canRedo="+undoableRosterList.canRedo());
                    if (undoableRosterList.canRedo()){
                        undoableRosterList.redo();
                        updateContext({type:'updateRoster',value:undoableRosterList});
                    }
                    break;
                case 90: //Handle Ctrl-Z
                    e.preventDefault();
                    console.log("RosterSchedulerBody.pastValue.length="+undoableRosterList.pastValue.length);
                    console.log("RosterSchedulerBody:undo,canUndo="+undoableRosterList.canUndo());
                    if (undoableRosterList.canUndo()){
                        undoableRosterList.undo();
                        updateContext({type:'updateRoster',value:undoableRosterList});
                    }
                    break;
                default:break;    
            }
        } else {
            switch (e.which){
                case  9://handle tab key
                    if (e.shiftKey){
                        selectedRegionUtil.selectNextCell(e,-1,0);
                    }else {
                        selectedRegionUtil.selectNextCell(e,1,0);
                    }
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    })
					break;
                case 13://handle "Enter" key event
                    if (e.shiftKey){
                        selectedRegionUtil.selectNextCell(e,0,-1);
                    } else {
                        selectedRegionUtil.selectNextCell(e,0,1);
                    }
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    })
					break;
                case 27://handle "Esc" key event
                    selectedRegionUtil.clearCopiedRegion();
                    updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    break;
                case 37://handle left arrow key event
                    selectedRegionUtil.selectNextCell(e,-1,0);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    })
                    break;
                case 38://handle up arrow key event
                    selectedRegionUtil.selectNextCell(e,0,-1);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    })
                    break;
                case 39://handle right arrow key event
                    selectedRegionUtil.selectNextCell(e,1,0);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    })
                    break;
                case 40://handle down arrow key event
                    selectedRegionUtil.selectNextCell(e,0,1);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    })
                    break;
                case 46://handle delete key event
                    e.preventDefault();
                    selectedRegionUtil.deleteData(undoableRosterList);
                    updateContext({type:'updateRoster',value:undoableRosterList});
                    break
                default:break;
            }
        }
    },[selectedRegionUtil,updateContext,undoableRosterList]);    
    useEffect(()=>{
        document.addEventListener('keydown',keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown)
        }
    },[keyDown,selectedRegionUtil,undoableRosterList]);
//================================================================================================================
}