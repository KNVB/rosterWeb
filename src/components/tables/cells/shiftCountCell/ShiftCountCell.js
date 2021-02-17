import './ShiftCountCell.css';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
export default function ShiftCountCell(props){
    let finalClassName="shiftCountCell";
    if (props.className){
        finalClassName+=" "+props.className;
    }
    return (
        <BorderedAlignCenterCell className={finalClassName} >
            {props.children}
        </BorderedAlignCenterCell>    
    )
}