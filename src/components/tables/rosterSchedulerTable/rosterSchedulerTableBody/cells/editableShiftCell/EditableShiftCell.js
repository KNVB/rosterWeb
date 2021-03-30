import {useContext} from 'react';
import './EditableShiftCell.css';
import React from "react";
import RosterWebContext from '../../../../../../RosterWebContext'; 
import ShiftCell from '../../../../cells/shiftCell/ShiftCell';
import SelectedRegionUtil from '../../../../../../utils/SelectedRegionUtil';
export default function EditableShiftCell(props) {
  let {
    selectedRegion,
    setSelectedRegion
  } = useContext(RosterWebContext);
  function mouseEnterHandler(e){
    props.onMouseEnter(e);
    SelectedRegionUtil.updateSelect(e.target, selectedRegion,setSelectedRegion);
  }
  function mouseDownHandler(e){
    e.preventDefault();
    SelectedRegionUtil.startSelect(e.target,selectedRegion,setSelectedRegion);
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