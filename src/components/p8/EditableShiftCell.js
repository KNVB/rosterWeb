import ShiftCell from './ShiftCell';
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