import './HourCell.css';
import RosterTableCell from '../../../cells/rosterTableCell/RosterTableCell';
function HourCell(props){
    return (
        <RosterTableCell className="hourCell p-0 text-center" rowSpan="2">
            {props.children}
        </RosterTableCell>    
    )
}
export default HourCell;