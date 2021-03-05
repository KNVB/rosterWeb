import React from "react";
import ShiftCell from '../../../../cells/shiftCell/ShiftCell';
import './EditableShiftCell.css';
export default function EditableShiftCell(props) {
  return (
    <ShiftCell
      {...props}
      contentEditable={true}     
      suppressContentEditableWarning={true}
    >
      {props.children}
    </ShiftCell>
  );
}