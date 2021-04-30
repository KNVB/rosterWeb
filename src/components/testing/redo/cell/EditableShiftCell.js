import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
import ShiftCell from './ShiftCell';
import './EditableShiftCell.css';
export default function EditableShiftCell(props){
    let {rosterList,selectedRegionUtil}=useContext(RosterWebContext);
    function copyData(e){
        console.log("copyData");
        e.preventDefault();
        //console.log(rosterList);
        selectedRegionUtil.copySelectedRegion(e.clipboardData);
        props.updateContextValue({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function mouseEnterHandler(e){
        selectedRegionUtil.updateSelect(e.target);
        props.updateContextValue({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function mouseDownHandler(e){ 
        e.preventDefault();   
        selectedRegionUtil.startSelect(e.target);
        props.updateContextValue({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function pasteData(e){
        //console.log(rosterList);        
        selectedRegionUtil.pasteCopiedRegion(e.clipboardData,rosterList);        
        props.updateContextValue({type:"updateShiftValue"});
        e.preventDefault();
    }
    return (
        <ShiftCell
            {...props}
            onCopy={copyData}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            onPaste={pasteData}
            contentEditable={true}
            suppressContentEditableWarning={true}>
            {props.children}
        </ShiftCell>
    )
}