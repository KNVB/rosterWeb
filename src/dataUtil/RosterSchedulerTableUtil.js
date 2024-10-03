import { CopiedRegion } from "./CopiedRegion";
import RosterTableUtil from "./RosterTableUtil";
export default class RosterSchedulerTableUtil extends RosterTableUtil{
    #copiedRegion = new CopiedRegion();
    #firstX = -1; #firstY = -1;
    #isSelectMode = false; #isFirstInput = false;
    #maxCellIndex; #maxRowIndex; #minCellIndex;
    #minX = -1; #minY = -1; #maxX = -1; #maxY = -1;
    #minRowIndex = 5;
    constructor() {
        super();
        this.rosterRowIdList = [];
    }
    endSelect = () => {
        if (this.#isSelectMode) {
            this.#isSelectMode = false;
            this.#isFirstInput = true;
        }
    }
    getRowIndex = rowName => {
        return this.rosterRowIdList.indexOf(rowName) + this.#minRowIndex;
    }
    getSelectedCssClass = (cellIndex, rowIndex) => {
        let result = this.#copiedRegion.getCopiedClass(cellIndex, rowIndex);
        if (result.length === 0) {
            if ((rowIndex === this.#minY) && (cellIndex >= this.#minX) && (cellIndex <= this.#maxX)) {
                result.push("selectCellBorderTop");
            }
            if ((rowIndex === this.#maxY) && (cellIndex >= this.#minX) && (cellIndex <= this.#maxX)) {
                result.push("selectCellBorderBottom");
            }
            if ((cellIndex === this.#maxX) && (rowIndex >= this.#minY) && (rowIndex <= this.#maxY)) {
                result.push("selectCellBorderRight");
            }
            if ((cellIndex === this.#minX) && (rowIndex >= this.#minY) && (rowIndex <= this.#maxY)) {
                result.push("selectCellBorderLeft");
            }
        }
        return result;
    }
    init = (calendarDateList, itoIdList, systemParam) => {
        this.#maxCellIndex = systemParam.noOfPrevDate + calendarDateList.length;
        //this.#maxRowIndex = itoIdList.length * 2 + 4;
        this.#maxRowIndex = itoIdList.length * 2 + this.#minRowIndex - 1;
        this.#minCellIndex = systemParam.noOfPrevDate + 1;
        this.#minX = -1; this.#minY = -1; this.#maxX = -1; this.#maxY = -1;
        this.#copiedRegion.clear();
        this.rosterRowIdList = [];
        itoIdList.forEach(itoId => {
            this.rosterRowIdList.push("rosterRow_" + itoId);
            this.rosterRowIdList.push("preferredShiftRow_" + itoId);
        });
    }
    selectCell = (columnIndex, rowIndex) => {
        let table = document.querySelector("table.rosterTable");
        let cell = table.rows[rowIndex].cells[columnIndex];
        let range = document.createRange();
        let sel = window.getSelection();
        range.selectNodeContents(cell.firstChild);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    setFocusCell = (e) => {
        let cell = e.target.closest("td");
        let sel = window.getSelection();
        let shiftContentDiv = cell.firstChild;
        shiftContentDiv.focus();
        sel.collapse(shiftContentDiv.firstChild, 1);
        this.#isFirstInput = false;
    }
    startSelect = (cellIndex, rowIndex) => {
        this.#minX = cellIndex;
        this.#minY = rowIndex;
        this.#firstX = cellIndex;
        this.#firstY = rowIndex;
        this.#maxX = cellIndex;
        this.#maxY = rowIndex;
        this.#isSelectMode = true;
    }
    updateUI(cellIndex, rowIndex) {
        super.updateUI(cellIndex, rowIndex);
        this.#updateSelectRegion(cellIndex, rowIndex);
    }
    //=============================================================================================================================================    
    #updateSelectRegion = (cellIndex, rowIndex) => {
        if ((this.#isSelectMode) && (cellIndex > -1) && (rowIndex > -1)) {
            let isChanged = false;
            let newMaxX = this.#maxX, newMinX = this.#minX;
            let newMaxY = this.#maxY, newMinY = this.#minY;
            if (cellIndex < this.#firstX) {
                newMinX = cellIndex;
                isChanged = true;
            }
            else {
                if (cellIndex > this.#firstX) {
                    newMaxX = cellIndex;
                    isChanged = true;
                }
                else {
                    newMinX = this.#firstX;
                    newMaxX = this.#firstX;
                    isChanged = true;
                }
            }
            if (rowIndex > this.#firstY) {
                newMaxY = rowIndex;
                isChanged = true;
            }
            else {
                if (rowIndex < this.#firstY) {
                    newMinY = rowIndex;
                    isChanged = true;
                }
                else {
                    newMinY = this.#firstY;
                    newMaxY = this.#firstY;
                    isChanged = true;
                }
            }
            if (isChanged) {
                this.#minX = newMinX;
                this.#maxX = newMaxX;
                this.#minY = newMinY;
                this.#maxY = newMaxY;
            }
        }
    }
}