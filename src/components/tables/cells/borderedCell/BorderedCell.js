import './BorderedCell.css';
export default function BorderedCell(props){
    let myProps={};
    Object.keys(props).forEach(key=>{
      myProps[key]=props[key];
    })
    if (props.className===undefined){
      myProps.className="borderedCell";    
    } else {
      myProps.className+=" borderedCell";
    }
    return(
      <td {...myProps}>
        {props.children}
      </td>
    )
}