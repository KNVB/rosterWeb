import {useContext} from 'react';
import './EditableShiftCell.css';
import React from "react";
import RosterWebContext from '../../../../../utils/RosterWebContext'; 
import ShiftCell from '../../../cells/shiftCell/ShiftCell';
import SelectedRegionUtil from '../../../../../utils/SelectedRegionUtil';
export default function EditableShiftCell(props) {
  let {
    selectedRegion,
    setSelectedRegion
  } = useContext(RosterWebContext);
  const editableShiftCellProps=Object.assign({},props);
  let cssClassName=props.className+" "+SelectedRegionUtil.getSelectedRegionCssClass(props.cellIndex,props.rowIndex,selectedRegion);
  //let cssClassName=props.className+" "+SelectedRegionUtil.getBorderClass(props.cellIndex,props.rowIndex,selectedRegion);
  cssClassName=cssClassName.trim();
  delete editableShiftCellProps.className;
  delete editableShiftCellProps.cellIndex;
  delete editableShiftCellProps.rowIndex;

  function copyData(e){
    e.preventDefault();
    console.log("Copy");
    SelectedRegionUtil.copySelectedRegion(selectedRegion,setSelectedRegion);
  }  
  function mouseEnterHandler(e){
    props.onMouseEnter(e);
    SelectedRegionUtil.updateSelect(e.target, selectedRegion,setSelectedRegion);
  }
  function mouseDownHandler(e){    
    SelectedRegionUtil.startSelect(e.target,selectedRegion,setSelectedRegion);
  }
  

  return (
    <ShiftCell
      {...editableShiftCellProps}
      className={cssClassName}
      contentEditable={true}
      onCopy={copyData}
      
      onMouseDown={mouseDownHandler}
      onMouseEnter={mouseEnterHandler}      
      
      suppressContentEditableWarning={true}
    >
      {props.children}
    </ShiftCell>
  );
}