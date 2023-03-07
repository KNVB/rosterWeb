export default class SelectedRegion {
    constructor() {
        this.firstInput = false;

        let init = () => {
            this.colCount = -1;
            this.firstX = -1;
            this.firstY = -1;
            this.minX = -1;
            this.minY = -1;
            this.maxX = -1;
            this.maxY = -1;
            this.rowCount = -1;
            this.selectedCellList = [];
            this.inSelectMode = false;
        }
        init();
        this.endSelect = function () {
            if (this.inSelectMode) {
                this.inSelectMode = false;
            }
        }
        this.getSelectedClassName = function (cellIndex, rowIndex) {
            let result = [];

            if ((rowIndex === this.minY) && (cellIndex >= this.minX) && (cellIndex <= this.maxX)) {
                result.push("selectCellBorderTop");
            }
            if ((rowIndex === this.maxY) && (cellIndex >= this.minX) && (cellIndex <= this.maxX)) {
                result.push("selectCellBorderBottom");
            }
            if ((cellIndex === this.maxX) && (rowIndex >= this.minY) && (rowIndex <= this.maxY)) {
                result.push("selectCellBorderRight");
            }
            if ((cellIndex === this.minX) && (rowIndex >= this.minY) && (rowIndex <= this.maxY)) {
                result.push("selectCellBorderLeft");
            }
            result = result.join(" ");
            
            console.log("=======================================");
            console.log("cellIndex=" + cellIndex + ", rowIndex=" + rowIndex);
            console.log("this.firstX=" + this.firstX + ", this.firstY=" + this.firstY);
            console.log("this.maxX=" + this.minX + ", this.maxY=" + this.minY);
            console.log("this.minX=" + this.minX + ", this.minY=" + this.minY);
            console.log("result:" + result);
            console.log("=======================================");
            
            return result;
        }
        this.startSelect = function (cellIndex, rowIndex) {
            this.firstX = cellIndex;
            this.maxX = cellIndex;
            this.minX = cellIndex;
            this.firstY = rowIndex;
            this.maxY = rowIndex;
            this.minY = rowIndex;
            this.inSelectMode = true;
        }
        this.update = function (cellIndex, rowIndex) {
            if ((this.inSelectMode) && (cellIndex > -1) && (rowIndex > -1)) {
                let isChanged = false;
                let newMaxX = this.maxX, newMinX = this.minX;
                let newMaxY = this.maxY, newMinY = this.minY;
                if (cellIndex < this.firstX) {
                    newMinX = cellIndex;
                    isChanged = true;
                }
                else {
                    if (cellIndex > this.firstX) {
                        newMaxX = cellIndex;
                        isChanged = true;
                    }
                    else {
                        newMinX = this.firstX;
                        newMaxX = this.firstX;
                        isChanged = true;
                    }
                }
                if (rowIndex > this.firstY) {
                    newMaxY = rowIndex;
                    isChanged = true;
                }
                else {
                    if (rowIndex < this.firstY) {
                        newMinY = rowIndex;
                        isChanged = true;
                    }
                    else {
                        newMinY = this.firstY;
                        newMaxY = this.firstY;
                        isChanged = true;
                    }
                }
                if (isChanged) {
                    this.minX = newMinX;
                    this.maxX = newMaxX;
                    this.minY = newMinY;
                    this.maxY = newMaxY;
                   //console.log("this.minX=" + this.minX + ",this.maxX=" + this.maxX);
                   //console.log("this.minY=" + this.minY + ",this.maxY=" + this.maxY);
                }
            }
        }
    }
}