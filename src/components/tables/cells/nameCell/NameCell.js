import './NameCell.css';
import RosterTableCell from '../rosterTableCell/RosterTableCell';
function NameCell(props){
    let  nameCellClass="nameCell p-0";
    if (props.hightLightRowIndex===1)
        nameCellClass+=" highlightCell";

    return (
        <RosterTableCell className={nameCellClass}>
            {props.children}
        </RosterTableCell>    
    )
}
export default NameCell;