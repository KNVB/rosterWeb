import ShiftCell from "../shiftCell/ShiftCell";

export default function CursoredShiftCell(props){
    let myProps={};
    Object.keys(props).forEach(key=>{
      if ((key!=="setHightLightCellIndex")  && (key!=="setHightLightRowIndex"))
        myProps[key]=props[key];
    })
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
    return (
        <ShiftCell  {...myProps}
            onMouseOut={deHightLight}
            onMouseOver={hightLight}
            shiftInfoList={props.shiftInfoList}>
            {props.children}   
        </ShiftCell>
    );
}