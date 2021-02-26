import React from "react";
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
export default function PreferredShiftCell(props) {
  return (
    <BorderedAlignCenterCell
      {...props}
      contentEditable={true}     
      suppressContentEditableWarning={true}
    >
      {props.children}
    </BorderedAlignCenterCell>
  );
}