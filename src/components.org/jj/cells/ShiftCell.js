import React,{useContext} from "react";
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../../utils/RosterWebContext';
import useShift from '../hooks/useShift';
import './ShiftCell.css';
export default function ShiftCell(props){
  let {activeShiftInfo,itoRosterList,setITORosterList}= useContext(RosterWebContext);
  
  let [getShiftCssClassName]=useShift(activeShiftInfo,itoRosterList,setITORosterList);
  let finalClassName=getShiftCssClassName(props.children)+" shiftCell";
  return(
    <BorderedAlignCenterCell
      {...props}
      className={finalClassName}>
      {props.children}
    </BorderedAlignCenterCell>
  )
}