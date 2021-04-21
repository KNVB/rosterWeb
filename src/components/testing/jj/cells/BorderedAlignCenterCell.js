import './BorderedAlignCenterCell.css';
import BorderedCell from './BorderedCell';
import React,{useContext} from "react";
export default function BorderedAlignCenterCell(props){
  let finalClassName=props.className+" alignCenter";
  return (
    <BorderedCell {...props} className={finalClassName}>
      {props.children}
    </BorderedCell>
  )
}