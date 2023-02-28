export class SelectedRegion {
    constructor() {
        this.firstInput=false;
		this.inSelectMode=false;        
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
        }
        init();
    }
}