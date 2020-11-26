import './NameCell.css';
import RosterTableCell from '../rosterTableCell/RosterTableCell';
function NameCell(props){
    return (
        <RosterTableCell className="nameCell" content={props.content}/>
    )
}
export default NameCell;