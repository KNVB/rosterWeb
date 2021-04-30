import { useCallback,useContext,useEffect } from 'react';
import RedoRow from './RedoRow';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function RedoBody(props){
    let {rosterList,selectedRegionUtil}=useContext(RosterWebContext);
    let rowList=[];
    //console.log(Object.keys(rosterList.present["ITO1_1999-01-01"].shiftList).length);
    if (rosterList){
        Object.keys(rosterList.presentValue).forEach(itoId=>{
            rowList.push(<RedoRow itoId={itoId} key={itoId+"_roster"} rowIndex={rowList.length+3} updateContextValue={props.updateContextValue}/>);
        });
    }
    let keyDown=useCallback((e)=>{
        console.log("keyDown");
        if (e.ctrlKey){
            //console.log(e.which);
            switch (e.which){
                case 89:
                    console.log("redo:"+JSON.stringify(rosterList));
                    console.log("RedoBody.redo="+rosterList.canRedo);
                    if (rosterList.canRedo){
                        e.preventDefault();
                        rosterList.redo();
                        props.updateContextValue({type:"updateShiftValue"});
                    }
                    break;
                case 90:
                    e.preventDefault();
                    console.log("RedoBody.undo="+rosterList.canUndo);
                    if (rosterList.canUndo){
                        rosterList.undo();
                        props.updateContextValue({type:"updateShiftValue"});
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
            props.updateContextValue({type:'updateSelectedRegion',value:selectedRegionUtil});
        }    
    },[props,rosterList,selectedRegionUtil]);    
    let mouseUp=useCallback((e)=>{
        console.log("mouse up");
        selectedRegionUtil.endSelect();
        props.updateContextValue({type:'updateSelectedRegion',value:selectedRegionUtil});
    },[props,selectedRegionUtil]);
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
    },[keyDown]);
    return (
        <tbody>
            {rowList}
        </tbody>
    )
}