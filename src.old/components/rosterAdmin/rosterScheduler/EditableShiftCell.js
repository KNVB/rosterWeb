import ShiftCell from "../../common/cells/ShiftCell";
export default function EditableShiftCell({
    children, cssClassName, keyDownHandler, onBlur,
    onContextMenu, onPaste, title, uiAction }) {
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
        <ShiftCell
            cssClassName={cssClassName + " m-0 p-0 position-relative"}
            onContextMenu={onContextMenu}
            onMouseDown={uiAction.startSelect}
            onMouseEnter={handleMouseEnterEvent}
            onMouseLeave={handleMouseLeaveEvent}
            onPaste={onPaste}
            title={title}>
            <div
                className="shiftContent"
                contentEditable={true}
                onBlur={onBlur}
                onDoubleClick={uiAction.setFocusCell}
                onCopy={uiAction.copyRosterData}
                onKeyDown={keyDownHandler}
                suppressContentEditableWarning={true}>
                {children}
            </div>
            {
                isLastCell &&
                <div className="littleSquareDiv m-0 p-0"></div>
            }
        </ShiftCell>
    );
}