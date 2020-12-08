import './NameCell.css';
import RosterTableCell from '../rosterTableCell/RosterTableCell';
function NameCell(props){
    let  nameCellClass="nameCell";
    if (props.hightLightRowIndex===1)
        nameCellClass+=" highlightCell";

    return (
        <RosterTableCell className={nameCellClass} content={props.content}/>
    )
}
export default NameCell;