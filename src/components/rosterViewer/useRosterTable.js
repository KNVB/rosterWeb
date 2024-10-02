import { useEffect, useReducer } from "react";
import RosterTableUtil from "./RosterTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        default:
            break;
    }
    return result;
}
export default function useRosterTable(){
    const [itemList, updateItemList] = useReducer(reducer,{
        rosterTableUtil: new RosterTableUtil(),
    });
    let isHighLightCell=(cellIndex)=>{
        return itemList.rosterTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterTableUtil.isHighLightRow(rowIndex);
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({ cellIndex, rowIndex, type: "refresh" });
    }
    return {
        uiAction:{
            isHighLightCell,
            isHighLightRow,
            updateUI
        }
    }
}