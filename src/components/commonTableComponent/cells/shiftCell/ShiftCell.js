import RosterTableCell from '../rosterTableCell/RosterTableCell';
import './ShiftCell.css';
function ShiftCell(props){
    let shiftClass="p-0 text-center shiftCell";
    let deHightLight=(e)=>{
        props.setHightLightRowIndex(-1);
        props.setHightLightCellIndex(-1);
    }
    let hightLight=(e)=>{
        //console.log(e.target.cellIndex);
        //console.log(JSON.stringify(e.target));
        props.setHightLightCellIndex(e.target.cellIndex);
        props.setHightLightRowIndex(1);
    }
    switch (props.children){
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
        default:
            break;    
    }
    return (
        <RosterTableCell 
            className={shiftClass} 
            onMouseOut={deHightLight}
            onMouseOver={hightLight}>
            {props.children}
        </RosterTableCell>
    )
}
export default ShiftCell;