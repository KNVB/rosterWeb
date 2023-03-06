import "./EditableShiftCell.css";
import ShiftCell from "../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {
        children, cssClassName,
        isFocus,
        onBlur, onCopy, onFocus,
        onKeyDown,
        onMouseDown, onMouseEnter, onMouseLeave,
        onPaste
    } = props;
    let className = "position-relative";
    if (cssClassName) {
        className += " " + cssClassName;
    }
    return (
        <ShiftCell
            cssClassName={className}
            onBlur={onBlur}
            onCopy={onCopy}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPaste={onPaste}>
            <div
                className="shiftContent"
                contentEditable={true}
                suppressContentEditableWarning={true}>
                {children}
            </div>
            {
                isFocus &&
                <div className="littleSquareDiv"></div>
            }
        </ShiftCell>
    )
}