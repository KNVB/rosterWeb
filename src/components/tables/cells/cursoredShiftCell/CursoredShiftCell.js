import {useContext} from 'react';
import RosterWebContext from '../../../../RosterWebContext';
import ShiftCell from '../shiftCell/ShiftCell';
export default function CursoredShiftCell(props){
    let { setHightLightCellIndex,setHighLightRowIndex } = useContext(RosterWebContext);
 
    let deHightLight = e => {
        //props.setIstHightLightRow(false);
        setHightLightCellIndex(-1);
        setHighLightRowIndex();
    };
    let hightLight = e => {
        //console.log(e.target.cellIndex);
        //props.setIstHightLightRow(true);
        setHightLightCellIndex(e.target.cellIndex);
        setHighLightRowIndex({itoId:props.itoId,rowType:props.rowType});
    };
    return(
        <ShiftCell 
            onMouseOut={deHightLight}
            onMouseOver={hightLight}>
            {props.children}
        </ShiftCell>
    )
} 