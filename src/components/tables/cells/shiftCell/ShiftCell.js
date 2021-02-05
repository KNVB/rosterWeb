import RosterTableCell from '../rosterTableCell/RosterTableCell';
import './ShiftCell.css';
function ShiftCell(props){
    let shiftClass="p-0 text-center shiftCell";
    //console.log(props);
    let myProps={};
    Object.keys(props).forEach(key=>{
        myProps[key]=props[key];
    })
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
            {...myProps}
            className={shiftClass}>
            {props.children}
        </RosterTableCell>
    )
}
export default ShiftCell;