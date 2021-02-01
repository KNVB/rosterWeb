import './RosterTableCell.css';
function RosterTableCell(props){
  let myProps={};
  Object.keys(props).forEach(key=>{
    myProps[key]=props[key];
  })
  if (props.className===undefined){
    myProps.className="rosterTableCell";    
  } else {
    myProps.className+=" rosterTableCell";
  }
  return(
    <td {...myProps}>
      {props.children}
    </td>
  )
}
export default RosterTableCell;