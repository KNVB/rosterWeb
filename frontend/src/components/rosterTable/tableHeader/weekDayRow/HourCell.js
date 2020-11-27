import './HourCell.css';
import RosterTableCell from '../../rosterTableCell/RosterTableCell';
function HourCell(props){
    return (
        <RosterTableCell className="hourCell text-center" content={props.content} rowSpan="2"/>
    )
}
export default HourCell;