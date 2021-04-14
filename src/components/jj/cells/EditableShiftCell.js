import React,{useContext} from "react";
import ShiftCell from './ShiftCell';
import WebContext from '../WebContext';
export default function EditableShiftCell(props){
  let {updateShift}=useContext(WebContext);
  return (
    <ShiftCell
      contentEditable={true}
      onBlur={(e)=>updateShift(e,props)}
      suppressContentEditableWarning={true}>
      {props.children}
    </ShiftCell>
  )
}