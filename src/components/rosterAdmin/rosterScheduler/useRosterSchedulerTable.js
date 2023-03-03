import { useEffect, useReducer } from 'react';
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "updateHighLight":
            result.highLightCellIndex = action.cellIndex;
            result.highLightRowIndex = action.rowIndex;
            break;
        default:
            break;
    }
    return result;
}
export function useRosterSchedulerTable(){
    const [itemList, updateItemList] = useReducer(reducer, {
        highLightCellIndex: -1,
        highLightRowIndex: -1,
    });
    let updateHighLight = (cellIndex, rowIndex) => {
        updateItemList({ type: "updateHighLight", cellIndex: cellIndex, rowIndex: rowIndex });
    }
    return [itemList,updateHighLight];
}