import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
import ShiftCell from './ShiftCell';
import './EditableShiftCell.css';
export default function EditableShiftCell(props){
    let {rosterList,selectedRegionUtil,undoUtil}=useContext(RosterWebContext);
    function copyData(e){
        e.preventDefault();
        selectedRegionUtil.copySelectedRegion(e.clipboardData);
    }
    function mouseEnterHandler(e){
        selectedRegionUtil.updateSelect(e.target);
    }
    function mouseDownHandler(e){    
        selectedRegionUtil.startSelect(e.target);
    }
    function pasteData(e){
        selectedRegionUtil.pasteCopiedRegion(e.clipboardData,rosterList,undoUtil);
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