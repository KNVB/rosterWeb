import { useEffect, useReducer } from "react";
import RosterSchedulerTableUtil from "../../../dataUtil/RosterSchedulerTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterSchedulerTableUtil.init(
                action.calendarDateList,
                action.itoIdList,
                action.systemParam);
            break
        default:
            break;
    }
    return result;
}
export default function useRosterSchedulerTable(rosterSchedulerData) {
    const [itemList, updateItemList] = useReducer(reducer, {
        rosterSchedulerTableUtil: new RosterSchedulerTableUtil(),
    });
    useEffect(()=>{
        if (rosterSchedulerData){
            updateItemList({
                calendarDateList:rosterSchedulerData.calendarDateList,
                itoIdList:rosterSchedulerData.itoIdList,
                systemParam:rosterSchedulerData.systemParam,
                "type":"init"
            })
        }
    },[rosterSchedulerData]);
    let endSelect = () => {
        itemList.rosterSchedulerTableUtil.endSelect();
        updateItemList({ type: "refresh" });
    }
    let getSelectedCssClass = (cellIndex, rowIndex) => {
        return itemList.rosterSchedulerTableUtil.getSelectedCssClass(cellIndex, rowIndex);
    }
    let getRowIndex = rowName => {
        return itemList.rosterSchedulerTableUtil.getRowIndex(rowName);
    }
    let isHighLightCell = (cellIndex) => {
        return itemList.rosterSchedulerTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let startSelect = e => {
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        //console.log(cell.cellIndex, rowIndex)
        e.preventDefault();
        itemList.rosterSchedulerTableUtil.selectCell(cell.cellIndex, rowIndex);
        itemList.rosterSchedulerTableUtil.startSelect(cell.cellIndex, rowIndex);
        updateItemList({ type: "refresh" });
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterSchedulerTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({ cellIndex, rowIndex, type: "refresh" });
    }
    return {
        uiAction: {
            endSelect,            
            getRowIndex,
            getSelectedCssClass,
            isHighLightCell,
            isHighLightRow,
            startSelect,
            updateUI
        }
    }
}