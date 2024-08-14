import ShiftCell from "../../common/cells/ShiftCell";
export default function EditableShiftCell(props) {
    let { cssClassName, children, onBlur, onPaste, title, uiAction } = props;
    console.log(uiAction);
    return (
        <ShiftCell
            cssClassName={cssClassName + " m-0 p-0 position-relative"}>
            {children}
        </ShiftCell>
    )
}