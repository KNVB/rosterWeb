export default function KeyboardEventHandler(itemList, updateItemList) {
    const handleKeyDown = e => {
        if (itemList.rosterSchedulerTableUtil.isFirstInput()) {
            switch (e.key) {
                case "ArrowDown"://handle down arrow key event
                    handleArrowKeyEvent(e, 1, 0);
                    break;
                case "ArrowLeft"://handle left arrow key event
                    handleArrowKeyEvent(e, 0, -1);
                    break;
                case "ArrowRight"://handle right arrow key event
                    handleArrowKeyEvent(e, 0, 1);
                    break;
                case "ArrowUp"://handle up arrow key event
                    handleArrowKeyEvent(e, -1, 0);
                    break;
                case "Delete"://handle delete key event
                    handleDelKeyEvent(e);
                    break;
                case "Escape"://handle esc key event
                    handleEscKeyEvent(e);
                    break;
                case "Tab"://handle tab key
                    if (e.shiftKey) {
                        handleArrowKeyEvent(e, 0, -1);
                    } else {
                        handleArrowKeyEvent(e, 0, 1);
                    }
                    break;
                case "y"://handle redo 
                    if (e.ctrlKey) {
                        e.preventDefault();
                        itemList.rosterSchedulerData.reDo();
                        updateItemList({ type: "refresh" });
                    }
                    break;
                case "z"://handle undo 
                    if (e.ctrlKey) {
                        e.preventDefault();                        
                        itemList.rosterSchedulerData.unDo();
                        updateItemList({ type: "refresh" });
                    }
                    break;
                default:
                    break
            }
        }
    }
    const handleArrowKeyEvent = (e, yOffset, xOffset) => {
        e.preventDefault();
        let cell = e.target.closest("td");
        let nextCell = itemList.rosterSchedulerTableUtil.getNextCell(cell, yOffset, xOffset);
        itemList.rosterSchedulerTableUtil.selectCell(nextCell.cellIndex, nextCell.rowIndex);
        itemList.rosterSchedulerTableUtil.select(nextCell.cellIndex, nextCell.rowIndex);
        updateItemList({ type: "refresh" });
    }
    const handleDelKeyEvent = (e) => {
        e.preventDefault();
        let selectedLocation = getSelectedLocation(itemList.rosterSchedulerTableUtil, itemList.rosterSchedulerData.systemParam);        
        itemList.rosterSchedulerData.deleteSelectedData(
            selectedLocation, 
            itemList.rosterSchedulerData.roster.noOfWorkingDay, 
            itemList.rosterSchedulerData.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    const handleEscKeyEvent = (e) => {
        e.preventDefault();
        itemList.rosterSchedulerTableUtil.clearCopiedRegion();
        itemList.rosterSchedulerData.clearCopiedData();
        updateItemList({ type: "refresh" });
    }
    let getSelectedLocation = (rosterSchedulerTableUtil, systemParam) => {
        let selectedLocation = rosterSchedulerTableUtil.getSelectedLocation();
        selectedLocation.column.end -= systemParam.noOfPrevDate;
        selectedLocation.column.start -= systemParam.noOfPrevDate;
        return selectedLocation;
    }
    return { handleKeyDown };
}