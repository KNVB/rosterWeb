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
    //console.log(e.target.parentElement.id);
    if (selectedRegion.inSelectMode){
      let temp=JSON.parse(JSON.stringify(selectedRegion));
      temp=Utility.updateSelect(e.target,temp);
      console.log("temp="+JSON.stringify(temp));
      setSelectedRegion(temp);
    }
  }
  function mouseDownHandler(e){
    e.preventDefault();
    let temp=JSON.parse(JSON.stringify(selectedRegion));
    temp=Utility.startSelect(e.target,temp);
    console.log("temp="+JSON.stringify(temp));
    setSelectedRegion(temp);
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