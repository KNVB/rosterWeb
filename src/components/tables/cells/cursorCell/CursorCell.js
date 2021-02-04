import ShiftCell from '../shiftCell/ShiftCell';
function CursorCell(props){
    //console.log(JSON.stringify(props));
    let deHightLight=(e)=>{
        props.setHightLightRowIndex(-1);
        props.setHightLightCellIndex(-1);
    }
    let hightLight=(e)=>{
        console.log(e.target.cellIndex);
        console.log(JSON.stringify(e.target));
        //props.setHightLightCellIndex(e.target.cellIndex);
        //props.setHightLightRowIndex(1);
    }
    return (
        <ShiftCell 
            onMouseOut={deHightLight}
            onMouseOver={hightLight}>
            {props.children}
        </ShiftCell>
    )
}
export default CursorCell;