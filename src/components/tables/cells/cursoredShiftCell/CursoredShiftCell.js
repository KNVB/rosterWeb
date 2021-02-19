import ShiftCell from '../shiftCell/ShiftCell';
import Utility from '../../../../utils/Utility';
export default function CursoredShiftCell(props){
    let GG=Utility.withCursor(ShiftCell);
    return <GG {...props}>{props.children}</GG>;
} 