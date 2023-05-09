import "./EditableShiftCell.css";
import { useRef } from "react";
import ShiftCell from "../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {
        children, cssClassName,
        onBlur, onCopy,onKeyDown,
        onFocus, onPaste,
        uiAction
    } = props;
    let className = "shiftContent";
    let shiftTypeRef = useRef();
    if (cssClassName) {
        className += " " + cssClassName;
    }
    let isLastCell = ((cssClassName.indexOf("selectCellBorderRight") > -1) && (cssClassName.indexOf("selectCellBorderBottom") > -1));
    
    function handleMouseDownEvent(e) {
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        console.log(e.target,cell.cellIndex, rowIndex);     
        uiAction.startSelect(cell.cellIndex, rowIndex);
        /*
        let range = document.createRange();
        let sel = window.getSelection();
		range.selectNodeContents(cell.firstElementChild.firstElementChild);
		sel.removeAllRanges();
		sel.addRange(range);
        uiAction.startSelect(cell.cellIndex, rowIndex);
        */
    }
    function handleMouseEnterEvent(e) {
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        uiAction.updateUI(cell.cellIndex, rowIndex);
    }
    function handleMouseLeaveEvent(e) {
        e.preventDefault();
        uiAction.updateUI(-1, -1);
    }   
    return (
        <ShiftCell
            cssClassName="position-relative"
            onBlur={onBlur}
            onCopy={onCopy}            
            onFocus={onFocus}            
            onMouseDown={handleMouseDownEvent}
            onMouseEnter={handleMouseEnterEvent}
            onMouseLeave={handleMouseLeaveEvent}
            onPaste={onPaste}>
            <div
                className={className}>
                <div
                    className="shiftType"
                    contentEditable={true}
                    onKeyDown={onKeyDown}
                    ref={shiftTypeRef}
                    suppressContentEditableWarning={true}>
                    {children}
                </div>
                {
                    isLastCell &&
                    <div className="littleSquareDiv"></div>
                }
            </div>
        </ShiftCell>
    )
}