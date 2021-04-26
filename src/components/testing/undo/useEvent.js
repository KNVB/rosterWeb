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