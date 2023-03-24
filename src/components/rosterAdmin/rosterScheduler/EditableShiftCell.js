export default function EditableShiftCell(props) {
    let {  uiAction, cssClassName, children, onBlur, onPaste } = props;
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
    let isLastCell = ((cssClassName.indexOf("selectCellBorderRight") > -1) && (cssClassName.indexOf("selectCellBorderBottom") > -1));
    return (
        <td
            className={cssClassName+" m-0 p-0 position-relative"}
            onMouseDown={uiAction.startSelect}
            onMouseEnter={handleMouseEnterEvent}
            onMouseLeave={handleMouseLeaveEvent}
            onPaste={onPaste}>
            <div
                className="shiftContent"
                contentEditable={true}
                onBlur={onBlur}
                onCopy={uiAction.copy}
                onDoubleClick={uiAction.setFocusCell}
                onKeyDown={uiAction.handleKeyDown}
                suppressContentEditableWarning={true}>
                {children}
            </div>
            {
                isLastCell &&
                <div className="littleSquareDiv m-0 p-0"></div>
            }
        </td>
    );
}
