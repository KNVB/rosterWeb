import './BorderedCell.css';
import React,{useContext} from "react";
export default function BorderedCell(props){
  
  let finalClassName=props.className+" borderedCell";
  
  return (
      <td {...props} className={finalClassName}>
        {props.children}
      </td>
  )
}