import ShiftCell from "../../common/cells/ShiftCell";
export default function EditableShiftCell({ children, cssClassName, title, uiAction, updateShift }) {
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
            onMouseDown={uiAction.startSelect}
            onMouseEnter={handleMouseEnterEvent}
            onMouseLeave={handleMouseLeaveEvent}
            title={title}>
            <div
                className="shiftContent"
                contentEditable={true}
                onBlur={updateShift}
                onDoubleClick={uiAction.setFocusCell}
                onCopy={uiAction.copyRosterData}
                onKeyDown={uiAction.handleKeyDown}
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