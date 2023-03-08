import "./EditableShiftCell.css";
import { useRef } from "react";
import ShiftCell from "../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {
        children, cssClassName,
        onBlur, onCopy,
        onFocus, onPaste,
        uiAction
    } = props;
    let className = "shiftContent";
    let shiftTypeRef = useRef();
    if (cssClassName) {
        className += " " + cssClassName;
    }
    let isLastCell = ((cssClassName.indexOf("selectCellBorderRight") > -1) && (cssClassName.indexOf("selectCellBorderBottom") > -1));
    
    function handleDoubleClick(e) {
        e.preventDefault();
        shiftTypeRef.current.focus();
    }
    function handleBlur(e){
        console.log(e.taget)
        e.preventDefault();
    }
    function handleKeyDownEvent(e) {
        e.preventDefault();
        switch (e.which) {
            case 9://handle tab key
                handleTabKeyEvent(e);
                break;
            default:
                break;    
        }
    }
    function handleMouseDownEvent(e) {
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        let range = document.createRange();
        let sel = window.getSelection();
		range.selectNodeContents(cell.firstElementChild.firstElementChild);
		sel.removeAllRanges();
		sel.addRange(range);
        uiAction.startSelect(cell.cellIndex, rowIndex);
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
    function handleTabKeyEvent(e){
        console.log("Tab event")
        let cell = e.target.closest("td");
        let row= cell.closest("tr");
        let rowIndex =row.rowIndex;
        let range = document.createRange();
        let sel = window.getSelection();
        //console.log(cell,cell.nextSibling);
        e.preventDefault();
        let nextCell;
        if (cell.nextSibling.querySelectorAll('[contenteditable=true]').length > 0 ){
            nextCell=cell.nextSibling.querySelectorAll('[contenteditable=true]')[0];
        }else {
            nextCell=row.querySelectorAll('[contenteditable=true]')[0];            
        }
        cell=nextCell.closest("td");
        range.selectNodeContents(nextCell);
		sel.removeAllRanges();
		sel.addRange(range);
        uiAction.select(cell.cellIndex, rowIndex);    
    }
    return (
        <ShiftCell
            cssClassName="position-relative"
            onBlur={onBlur}
            onCopy={onCopy}
            onDoubleClick={handleDoubleClick}
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
                    onKeyDown={handleKeyDownEvent}                
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