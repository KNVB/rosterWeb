import './ShiftCountCell.css';
import RosterTableCell from '../rosterTableCell/RosterTableCell';
function ShiftCountCell(props){
    let finalClassName="shiftCountCell text-center";
    if (props.className){
        finalClassName+=" "+props.className;
    }
    return (
        <RosterTableCell className={finalClassName} >
            {props.children}
        </RosterTableCell>    
    )
}
export default ShiftCountCell;