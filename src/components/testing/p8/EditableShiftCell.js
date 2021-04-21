import {useContext,useEffect,useState} from 'react';
import ShiftCell from './ShiftCell';
import RosterWebContext from '../../utils/RosterWebContext';

export default function EditableShiftCell(props){
    let{copySelectedRegion,pasteCopiedRegion,startSelect,updateSelect} = useContext(RosterWebContext);
    function copyData(e){
        e.preventDefault();
        copySelectedRegion(e.clipboardData);
    }
    function mouseDownHandler(e){    
        startSelect(e.target);
    }
    function mouseEnterHandler(e){
        updateSelect(e.target);
    }
    function pasteData(e){
        pasteCopiedRegion(e.clipboardData);
        e.preventDefault();
    }
    return (
        <ShiftCell
            {...props}
            contentEditable={true}
            onCopy={copyData}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            onPaste={pasteData}
            suppressContentEditableWarning={true}>
                {props.children}
        </ShiftCell>        
    )
}