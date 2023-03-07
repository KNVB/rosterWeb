import "./EditableShiftCell.css";
import ShiftCell from "../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {
        children, cssClassName,        
        onBlur, onCopy, onFocus,
        onKeyDown,
        onMouseDown, onMouseEnter, onMouseLeave,
        onPaste
    } = props;
    let className = "shiftContent";
    if (cssClassName) {
        className += " " + cssClassName;
    }
    let isLastCell=((cssClassName.indexOf("selectCellBorderRight")>-1) && (cssClassName.indexOf("selectCellBorderBottom")>-1));
    return (
        <ShiftCell
            cssClassName="position-relative"
            onBlur={onBlur}
            onCopy={onCopy}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPaste={onPaste}>
            <div
                className={className}
                contentEditable={true}
                suppressContentEditableWarning={true}>
                {children}
            </div>
            {
                isLastCell &&
                <div className="littleSquareDiv"></div>
            }
        </ShiftCell>
    )
}