import RosterTableCell from '../rosterTableCell/RosterTableCell';
import './ShiftCell.css';
function ShiftCell(props){
    var shiftClass="text-center shiftCell";
    switch (props.content){
        case "a":
            shiftClass+=" aShiftColor";
            break;
        case "b":
        case "b1":
            shiftClass+=" bShiftColor";
            break;       
        case "c":
            shiftClass+=" cShiftColor";
            break;
        case "d":
        case "d1":
        case "d2":
        case "d3":
            shiftClass+=" dShiftColor";
            break;
        case  "O":
            shiftClass+=" oShiftColor";
            break;
    }
    return (
        <RosterTableCell className={shiftClass} content={props.content}/>
    )
}
export default ShiftCell;