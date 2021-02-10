import CursoredShiftCell from "../cursoredShiftCell/CursoredShiftCell";
import { useState} from 'react';
export default function EditableShiftCell(props){
    const[shiftType,setShiftType]=useState(props.shiftType);
    function update(e){
        setShiftType(e.target.innerText);
        props.updateCount(e.target.cellIndex,e.target.innerText);
    }
    return (
        <CursoredShiftCell 
            contentEditable="true"
            onBlur={update}
            setHightLightCellIndex={props.setHightLightCellIndex}
            setHightLightRowIndex={props.setHightLightRowIndex}
            shiftInfoList={props.shiftInfoList}
            suppressContentEditableWarning={true} >
            {shiftType}
        </CursoredShiftCell>
    );    
}