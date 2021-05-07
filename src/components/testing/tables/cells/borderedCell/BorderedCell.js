import './BorderedCell.css';
export default function BorderedCell(props){
    return(
      <td {...props} 
        className={props.className+" borderedCell"}>
        {props.children}
      </td>
    )
}