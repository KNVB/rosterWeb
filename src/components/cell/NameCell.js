import './NameCell.css';
import BorderedCell from './BorderedCell';
export default function NameCell(props){
    let nameCellClass="nameCell m-0 p-0";
    if (props.className)
        nameCellClass=nameCellClass+" "+props.className;
    return (
        <BorderedCell className={nameCellClass}>
            {props.children}
        </BorderedCell>    
    )
}
