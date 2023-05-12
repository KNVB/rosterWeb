import { CopiedRegion } from "../components/rosterAdmin/rosterScheduler/util/CopiedRegion";
export default class RosterSchedulerTableUtil {
    constructor() {
        let copiedRegion = new CopiedRegion();
        let firstX = -1, firstY = -1;
        let highLightCellIndex = -1, highLightRowIndex = -1;
        let isSelectMode = false, isFirstInput = false;
        let maxCellIndex, maxRowIndex, minCellIndex;
        let minX = -1, minY = -1, maxX = -1, maxY = -1;
        let minRowIndex = 5;
        this.clearCopiedRegion=()=>{
            copiedRegion.clear();
        }
        this.endSelect = () => {
            if (isSelectMode) {
                isSelectMode = false;
                isFirstInput = true;
            }
        }
        this.getCopyRegionLocation = () => {
            let result=this.getSelectedLocation();
            copiedRegion.init({ maxX, minX, minY, maxY });
            return result;
        }
        this.getNextCell = (cell, yOffset, xOffset) => {
            let nextCellIndex, nextRowIndex;
            let row = cell.closest("tr");
            switch (true) {
                case (yOffset < 0):
                    nextRowIndex = row.rowIndex - 1;
                    break;
                case (yOffset > 0):
                    nextRowIndex = row.rowIndex + 1;
                    break;
                default:
                    nextRowIndex = row.rowIndex;
            }
            switch (true) {
                case (nextRowIndex > maxRowIndex):
                    nextRowIndex = minRowIndex;
                    break;
                case (nextRowIndex < minRowIndex):
                    nextRowIndex = maxRowIndex;
                    break;
                default:
                    break;
            }
            switch (true) {
                case (xOffset < 0):
                    nextCellIndex = cell.cellIndex - 1;
                    break;
                case (xOffset > 0):
                    nextCellIndex = cell.cellIndex + 1;
                    break;
                default:
                    nextCellIndex = cell.cellIndex;
                    break;
            }
            switch (true) {
                case (nextCellIndex > maxCellIndex):
                    nextCellIndex = minCellIndex;
                    break;
                case (nextCellIndex < minCellIndex):
                    nextCellIndex = maxCellIndex;
                    break;
                default:
                    break
            }
            return { cellIndex: nextCellIndex, rowIndex: nextRowIndex }
        }
        this.getPasteRowIds = (cell, rowCount) => {
            let result = [];
            let row = cell.closest("tr");
            result.push(row.id);
            for (let y = 1; y < rowCount; y++) {
                row = row.nextSibling;
                if ((row) && (row.id !== undefined) &&
                    (row.id.startsWith("rosterRow_") ||
                        row.id.startsWith("preferredShiftRow_"))) {
                    result.push(row.id);
                } else {
                    break;
                }
            }
            return result;
        }
        this.getSelectedCssClass = (cellIndex, rowIndex) => {
            let result = copiedRegion.getCopiedClass(cellIndex, rowIndex);
            if (result.length === 0) {
                if ((rowIndex === minY) && (cellIndex >= minX) && (cellIndex <= maxX)) {
                    result.push("selectCellBorderTop");
                }
                if ((rowIndex === maxY) && (cellIndex >= minX) && (cellIndex <= maxX)) {
                    result.push("selectCellBorderBottom");
                }
                if ((cellIndex === maxX) && (rowIndex >= minY) && (rowIndex <= maxY)) {
                    result.push("selectCellBorderRight");
                }
                if ((cellIndex === minX) && (rowIndex >= minY) && (rowIndex <= maxY)) {
                    result.push("selectCellBorderLeft");
                }
            }
            return result;
        }
        this.getSelectedLocation=()=>{
            let result = { column: { start: minX, end: maxX }, rows: [] };
            let row;
            let table = document.querySelector("table.rosterTable");
            for (let y = minY; y <= maxY; y++) {
                row = table.rows[y];
                result.rows.push(row.id);
            }
            return result;
        }
        this.init = (calendarDateList, itoIdList, systemParam) => {
            maxCellIndex = systemParam.noOfPrevDate + calendarDateList.length;
            maxRowIndex = itoIdList.length * 2 + 4;
            minCellIndex = systemParam.noOfPrevDate + 1;
            minX = -1; minY = -1; maxX = -1; maxY = -1;
            copiedRegion.clear();
        }
        this.isFirstInput = () => {
            return isFirstInput;
        }
        this.isHighLightCell = cellIndex => {
            return (highLightCellIndex === cellIndex);
        }
        this.isHighLightRow = rowIndex => {
            return (highLightRowIndex === rowIndex);
        }
        this.select = (cellIndex, rowIndex) => {
            minX = cellIndex;
            minY = rowIndex;
            firstX = cellIndex;
            firstY = rowIndex;
            maxX = cellIndex;
            maxY = rowIndex;
            isSelectMode = false;
            isFirstInput = true;
        }
        this.selectCell = (columnIndex, rowIndex) => {
            let table = document.querySelector("table.rosterTable");
            let cell = table.rows[rowIndex].cells[columnIndex];
            let range = document.createRange();
            let sel = window.getSelection();
            range.selectNodeContents(cell.firstChild);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        this.setFocusCell = (e) => {
            let cell = e.target.closest("td");
            let sel = window.getSelection();
            let shiftContentDiv = cell.firstChild;
            shiftContentDiv.focus();
            sel.collapse(shiftContentDiv.firstChild, 1);
            isFirstInput=false;
        }
        this.startSelect = (cellIndex, rowIndex) => {
            minX = cellIndex;
            minY = rowIndex;
            firstX = cellIndex;
            firstY = rowIndex;
            maxX = cellIndex;
            maxY = rowIndex;
            isSelectMode = true;
        }
        this.updateUI = (cellIndex, rowIndex) => {
            highLightCellIndex = cellIndex;
            highLightRowIndex = rowIndex;
            updateSelectRegion(cellIndex, rowIndex);
        }
        let updateSelectRegion = (cellIndex, rowIndex) => {
            if ((isSelectMode) && (cellIndex > -1) && (rowIndex > -1)) {
                let isChanged = false;
                let newMaxX = maxX, newMinX = minX;
                let newMaxY = maxY, newMinY = minY;
                if (cellIndex < firstX) {
                    newMinX = cellIndex;
                    isChanged = true;
                }
                else {
                    if (cellIndex > firstX) {
                        newMaxX = cellIndex;
                        isChanged = true;
                    }
                    else {
                        newMinX = firstX;
                        newMaxX = firstX;
                        isChanged = true;
                    }
                }
                if (rowIndex > firstY) {
                    newMaxY = rowIndex;
                    isChanged = true;
                }
                else {
                    if (rowIndex < firstY) {
                        newMinY = rowIndex;
                        isChanged = true;
                    }
                    else {
                        newMinY = firstY;
                        newMaxY = firstY;
                        isChanged = true;
                    }
                }
                if (isChanged) {
                    minX = newMinX;
                    maxX = newMaxX;
                    minY = newMinY;
                    maxY = newMaxY;
                }
            }
        }
    }
}