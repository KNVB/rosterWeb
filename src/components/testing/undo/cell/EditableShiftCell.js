import ShiftCell from './ShiftCell';
import './EditableShiftCell.css';
export default function EditableShiftCell(props){
    return (
        <ShiftCell
            {...props}
            contentEditable={true}
            suppressContentEditableWarning={true}>
            {props.children}
        </ShiftCell>
    )
}