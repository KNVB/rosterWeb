export default class RosterTableUtil {
    #highLightCellIndex = -1
    #highLightRowIndex = -1;
    isHighLightCell = cellIndex => {
        return (this.#highLightCellIndex === cellIndex);
    }
    isHighLightRow = rowIndex => {
        return (this.#highLightRowIndex === rowIndex);
    }
    updateUI(cellIndex, rowIndex) {
        this.#highLightCellIndex = cellIndex;
        this.#highLightRowIndex = rowIndex;
    }
}