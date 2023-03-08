import "./EditableShiftCell.css";
import ShiftCell from "../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {
        children, cssClassName,
        onBlur, onCopy,
        onKeyDown, onFocus,
        onPaste,
        uiAction
    } = props;
    let className = "shiftContent";
    if (cssClassName) {
        className += " " + cssClassName;
    }
    let isLastCell = ((cssClassName.indexOf("selectCellBorderRight") > -1) && (cssClassName.indexOf("selectCellBorderBottom") > -1));
    function handleMouseDownEvent(e) {
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        uiAction.startSelect(cell.cellIndex, rowIndex);
    }
    function handleMouseEnterEvent(e) {
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        uiAction.updateUI(cell.cellIndex, rowIndex);
    }
    function handleMouseLeaveEvent(e) {
        uiAction.updateUI(-1, -1);
    }
    return (
        <ShiftCell
            cssClassName="position-relative"
            onBlur={onBlur}
            onCopy={onCopy}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onMouseDown={handleMouseDownEvent}
            onMouseEnter={handleMouseEnterEvent}
            onMouseLeave={handleMouseLeaveEvent}
            onPaste={onPaste}>
            <div
                className={className}>
                <span 
                    className="shiftType"
                    contentEditable={true}
                    suppressContentEditableWarning={true}>
                    {children}
                </span>
            </div>
            {
                isLastCell &&
                <div className="littleSquareDiv"></div>
            }
        </ShiftCell>
    )
}