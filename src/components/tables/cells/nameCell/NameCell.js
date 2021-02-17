import './NameCell.css';
import BorderedCell from '../../cells/borderedCell/BorderedCell';
export default function NameCell(props){
    let nameCellClass="nameCell p-0";    
    return (
        <BorderedCell className={props.className+" "+nameCellClass}>
            {props.children}
        </BorderedCell>    
    )
}
