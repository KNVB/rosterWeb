export default class EventHandler {
    #dataAction;
    #uiAction
    constructor(dataAction, uiAction) {
        this.#dataAction = dataAction;
        this.#uiAction = uiAction;
    }
    handleCopy = e => {
        e.preventDefault();
        let copyRegion = this.#uiAction.getCopyRegionLocation();
        this.#dataAction.copyRosterData(copyRegion);
    }
    handleDoubleClick=e=>{
        this.#uiAction.setFocusCell(e);
    }
    handleKeyDownEvent=e=>{
        switch (e.key) {
            case "ArrowDown"://handle down arrow key event
                this.#handleArrowKeyEvent(e, 0, 1, this.#uiAction);
                break;
            case "ArrowLeft"://handle left arrow key event
                this.#handleArrowKeyEvent(e, -1, 0, this.#uiAction);
                break;
            case "ArrowRight"://handle right arrow key event
                this.#handleArrowKeyEvent(e, 1, 0, this.#uiAction);
                break;
            case "ArrowUp"://handle up arrow key event
                this.#handleArrowKeyEvent(e, 0, -1, this.#uiAction);
                break;
            case "Delete"://handle delete key event
                this.#handleDelKeyEvent(e, this.#dataAction, this.#uiAction);
                break;
            case "Escape"://handle esc key event
                this.#handleEscKeyEvent(e, this.#uiAction);
                break;
            case "Tab"://handle tab key
                if (e.shiftKey) {
                    this.#handleArrowKeyEvent(e, -1, 0, this.#uiAction);
                } else {
                    this.#handleArrowKeyEvent(e, 1, 0, this.#uiAction);
                }
                break;
            case "y"://handle redo 
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.#dataAction.reDo();
                }
                break
            case "z"://handle undo 
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.#dataAction.unDo();
                }
                break
            default:
                break
        }
    }
    handleMouseDownEvent=e=>{
        this.#uiAction.startSelect(e);
    }
    
    handleMouseEnterEvent=e=>{
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        this.#uiAction.updateUI(cell.cellIndex, rowIndex);
    }
    handleMouseLeaveEvent=e=>{
        e.preventDefault();
        this.#uiAction.updateUI(-1, -1);
    }
    handlePaste=(e, dateOfMonth)=>{
        e.preventDefault();
        let rowCount = this.#dataAction.getCopyDataRowCount();
        if (rowCount > -1) {
            let selectedLocation = this.#uiAction.getSelectedLocation();
            this.#dataAction.paste(
                dateOfMonth,
                this.#uiAction.getRosterRowIdList(),
                selectedLocation
            );
        }
    }
    //===============================================================================
    #handleArrowKeyEvent = (e, xOffset, yOffset) => {
        e.preventDefault();
        let cell = e.target.closest("td");
        this.#uiAction.handleArrowKeyEvent(cell, xOffset, yOffset);
    }
    #handleDelKeyEvent = e => {
        e.preventDefault();
        let selectedLocation = this.#uiAction.getSelectedLocation();
        this.#dataAction.deleteSelectedData(selectedLocation);
    }
    #handleEscKeyEvent = e => {
        e.preventDefault();
        this.#uiAction.handleEscKeyEvent();
        this.#dataAction.handleEscKeyEvent();
    }    
}