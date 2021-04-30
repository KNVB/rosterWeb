import {useCallback,useEffect} from 'react';
export default function useEvent(selectedRegionUtil,undoUtil){
    let keyDown=useCallback((e)=>{
        console.log("keyDown");
        if (e.ctrlKey){
            //console.log(e.which);
            switch (e.which){
                case 89:
                    console.log("undoUtil.canRedo="+ undoUtil.canRedo);
                    if (undoUtil.canRedo){
                        e.preventDefault();
                        undoUtil.redo();
                    }
                    break;
                case 90:
                    console.log("canUndo="+undoUtil.canUndo);
                    if (undoUtil.canUndo){
                        e.preventDefault();
                        undoUtil.undo();
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
        }
    },[undoUtil]);
    useEffect(()=>{
        document.addEventListener('keydown',keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown)
        }
    },[keyDown]);
    
    let mouseUp=useCallback((e)=>{
        console.log("mouse up");
        selectedRegionUtil.endSelect();
    },[selectedRegionUtil]);
    useEffect(()=>{
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp]);
}