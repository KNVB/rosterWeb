export default function KeyboardEventHandler() {
    const handleKeyDown = (cellType, date, e, itoId, uiAction) => {
        if (uiAction.isSingleCellSelected()) {
            switch (e.key) {
                case "ArrowDown"://handle down arrow key event
                    handleArrowKeyEvent(e, 0, 1, uiAction);
                    break;
                case "ArrowLeft"://handle left arrow key event
                    handleArrowKeyEvent(e, -1, 0, uiAction);
                    break;
                case "ArrowRight"://handle right arrow key event
                    handleArrowKeyEvent(e, 1, 0, uiAction);
                    break;
                case "ArrowUp"://handle up arrow key event
                    handleArrowKeyEvent(e, 0, -1, uiAction);
                    break;
                case "Delete"://handle delete key event
                    handleDelKeyEvent(e, uiAction);
                    break;
                case "Escape"://handle esc key event
                    handleEscKeyEvent(e, uiAction);
                    break;
                case "Tab"://handle tab key
                    if (e.shiftKey) {
                        handleArrowKeyEvent(e, -1, 0, uiAction);
                    } else {
                        handleArrowKeyEvent(e, 1, 0, uiAction);
                    }
                    break;
                case "t":
                    if (cellType === "editableShiftCell"){
                        e.preventDefault();
                        uiAction.showShiftDetail(itoId, date);
                    }
                    break;
                case "y"://handle redo 
                    if (e.ctrlKey) {
                        e.preventDefault();
                        uiAction.reDo();
                    }
                    break
                case "z"://handle undo 
                    if (e.ctrlKey) {
                        e.preventDefault();
                        uiAction.unDo();
                    }
                    break
                default:
                    break
            }
        }
    }
    const handleArrowKeyEvent = (e, xOffset, yOffset, uiAction) => {
        e.preventDefault();
        let cell = e.target.closest("td");
        uiAction.handleArrowKeyEvent(cell, xOffset, yOffset);
    }
    const handleDelKeyEvent = (e, uiAction) => {
        e.preventDefault();
        uiAction.deleteSelectedData();
    }
    const handleEscKeyEvent = (e, uiAction) => {
        e.preventDefault();
        uiAction.handleEscKeyEvent();
    }
    return { handleKeyDown };
}