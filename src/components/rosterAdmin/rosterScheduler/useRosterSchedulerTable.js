import { useReducer } from 'react';
import { SelectedRegion } from './util/SelectedRegion';
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "endSelect":
            result.selectedRegion.endSelect();
            break;
        case "startSelect":
            result.selectedRegion.startSelect(action.cellIndex, action.rowIndex);
            break;
        case "updateUI":
            result.highLightCellIndex = action.cellIndex;
            result.highLightRowIndex = action.rowIndex;
            result.selectedRegion.update(action.cellIndex, action.rowIndex);
            break;
        default:
            break;
    }
    return result;
}
export function useRosterSchedulerTable() {
    const [itemList, updateItemList] = useReducer(reducer, {
        highLightCellIndex: -1,
        highLightRowIndex: -1,
        selectedRegion: new SelectedRegion()
    });
    let endSelect =()=>{
        updateItemList({ type: "endSelect" });
    }
    let getSelectedClassName=(cellIndex, rowIndex) => {
        return itemList.selectedRegion.getSelectedClassName(cellIndex, rowIndex);
    }
    let startSelect = (cellIndex, rowIndex) => {
        updateItemList({ cellIndex: cellIndex, rowIndex: rowIndex, type: "startSelect" });
    }
    let updateUI = (cellIndex, rowIndex) => {
        updateItemList({ cellIndex: cellIndex, rowIndex: rowIndex, type: "updateUI" });
    }
    return [itemList, endSelect,getSelectedClassName,startSelect, updateUI];
}