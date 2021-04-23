import {useContext,useEffect,useState} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
import ShiftCell from './ShiftCell';
import './EditableShiftCell.css';
export default function EditableShiftCell(props){
    let {copySelectedRegion, pasteCopiedRegion,rosterList,selectedRegion,startSelect,undoUtil,updateSelect}=useContext(RosterWebContext);
    function copyData(e){
        e.preventDefault();
        copySelectedRegion(e.clipboardData);
    }
    function mouseEnterHandler(e){
        updateSelect(e.target);
    }
    function mouseDownHandler(e){    
        startSelect(e.target);
    }
    function pasteData(e){
        pasteCopiedRegion(e.clipboardData,rosterList,undoUtil);
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