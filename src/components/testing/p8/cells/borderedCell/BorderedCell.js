import './BorderedCell.css';
export default function BorderedCell(props){
    let cssClass="borderedCell"+((props.className)?" "+props.className:"");
    //console.log("props.className="+props.className);
    return(
      <td {...props} 
        className={cssClass}>
        {props.children}
      </td>
    )
}