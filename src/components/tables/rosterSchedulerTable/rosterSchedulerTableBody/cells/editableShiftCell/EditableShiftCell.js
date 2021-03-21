import {useContext} from 'react';
import './EditableShiftCell.css';
import React from "react";
import ShiftCell from '../../../../cells/shiftCell/ShiftCell';
import RosterWebContext from '../../../../../../RosterWebContext'; 
import Utility from '../../../../../../utils/Utility';
export default function EditableShiftCell(props) {
  let {
    selectedRegion,
    setSelectedRegion
  } = useContext(RosterWebContext);
  function mouseEnterHandler(e){
    props.onMouseEnter(e);
    Utility.updateSelect(e.target, selectedRegion,setSelectedRegion);
  }
  function mouseDownHandler(e){
    e.preventDefault();
    Utility.startSelect(e.target,selectedRegion,setSelectedRegion);
  }
  return (
    <ShiftCell
      {...props}
      contentEditable={true}
      onMouseDown={mouseDownHandler}
      onMouseEnter={mouseEnterHandler}
      suppressContentEditableWarning={true}
    >
      {props.children}
    </ShiftCell>
  );
}