export default function KeyboardEventHandler(itemList, updateItemList) {
    const handleKeyDown = e => {
        if (itemList.rosterTableUtil.isFirstInput()) {
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
                case "Escape":
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
                        itemList.rosterSchedulerDataUtil.reDo();
                        updateItemList({ type: "refresh" });
                    }
                    break;
                case "z"://handle undo 
                    if (e.ctrlKey) {
                        e.preventDefault();
                        itemList.rosterSchedulerDataUtil.unDo();
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
        let nextCell = itemList.rosterTableUtil.getNextCell(cell, yOffset, xOffset);
        itemList.rosterTableUtil.selectCell(nextCell.cellIndex, nextCell.rowIndex);
        itemList.rosterTableUtil.select(nextCell.cellIndex, nextCell.rowIndex);
        updateItemList({ type: "refresh" });
    }
    const handleDelKeyEvent = (e) => {
        e.preventDefault();
        let selectedLocation = getSelectedLocation(itemList.rosterTableUtil, itemList.systemParam);
        itemList.rosterDataUtil.deleteSelectedData(selectedLocation, itemList.noOfWorkingDay, itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    const handleEscKeyEvent = (e) => {
        e.preventDefault();
        itemList.rosterTableUtil.clearCopiedRegion();
        itemList.rosterDataUtil.clearCopiedData();
        updateItemList({ type: "refresh" });
    }
    let getSelectedLocation = (rosterTableUtil, systemParam) => {
        let selectedLocation = rosterTableUtil.getSelectedLocation();
        selectedLocation.column.end -= systemParam.noOfPrevDate;
        selectedLocation.column.start -= systemParam.noOfPrevDate;
        return selectedLocation;
    }
    return { handleKeyDown };
}