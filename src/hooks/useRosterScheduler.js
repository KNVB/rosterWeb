import { useEffect, useReducer } from "react";
import KeyboardEventHandler from "../util/KeyboardEventHandler";
import RosterSchedulerData from "../dataUtil/RosterSchedulerData";
import RosterSchedulerTableUtil from "../dataUtil/RosterSchedulerTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.rosterSchedulerTableUtil.init(
                action.rosterSchedulerData.calendarDateList, 
                action.rosterSchedulerData.itoIdList,    
                action.rosterSchedulerData.systemParam);                
            result.isLoading = false;
            break;
        case "refresh":
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateRosterMonth":            
            result.rosterSchedulerTableUtil.init(
            result.rosterSchedulerData.calendarDateList, 
            result.rosterSchedulerData.itoIdList,    
            result.rosterSchedulerData.systemParam);
            break;
        default:
            break;
    }
    return result;
}
export function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        essentialShift: "",        
        isLoading: true,
        keyboardEventHandler:null,
        rosterSchedulerData: null,
        rosterSchedulerTableUtil:new RosterSchedulerTableUtil(),       
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterSchedulerData =new RosterSchedulerData();
            try {
                await rosterSchedulerData.load(rosterYear, rosterMonth + 1);
                updateItemList({
                    rosterSchedulerData,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    
    let endSelect = () => {
        itemList.rosterSchedulerTableUtil.endSelect();
        updateItemList({ type: "refresh" });
    }
    let getShiftCssClassName = shiftType => {
        return itemList.rosterSchedulerData.getShiftCssClassName(shiftType);
    }
    let getEditableShiftCellCssClassName=(cellIndex, rowIndex, shift)=>{
        let className = [];
        let temp=getShiftCssClassName(shift);
        if (temp!==""){
            className.push(temp);
        }
        temp = itemList.rosterSchedulerTableUtil.getSelectedCssClass(cellIndex, rowIndex);
        if (temp.length > 0) {
            className.push(...temp);
        }
        return className;
    }
    let { handleKeyDown } = KeyboardEventHandler(itemList, updateItemList);
    let isHighLightCell = cellIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let setFocusCell = e => {
        itemList.rosterSchedulerTableUtil.setFocusCell(e);
        updateItemList({ type: "refresh" });
    }
    let startSelect= e => {
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        //console.log(cell.cellIndex, rowIndex)
        e.preventDefault();
        itemList.rosterSchedulerTableUtil.selectCell(cell.cellIndex, rowIndex);
        itemList.rosterSchedulerTableUtil.startSelect(cell.cellIndex, rowIndex);
        updateItemList({ type: "refresh" });
    }
    let updateRosterMonth = async (newRosterMonth) => {
        try {
            await itemList.rosterSchedulerData.reload(newRosterMonth);
            
            updateItemList({
                type: "updateRosterMonth"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updateShift=(itoId, dateOfMonth, shift)=>{
        itemList.rosterSchedulerData.updateShift(itoId, dateOfMonth, shift);
        updateItemList({
            type: "refresh"
        });
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterSchedulerTableUtil.updateUI(cellIndex,rowIndex);
        updateItemList({
            type: "refresh"
        });
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        rosterSchedulerData: itemList.rosterSchedulerData,
        "uiAction": {
            endSelect,
            getEditableShiftCellCssClassName,
            getShiftCssClassName,
            handleKeyDown,
            isHighLightCell,
            isHighLightRow,
            setFocusCell,
            startSelect,
            updateRosterMonth,
            updateShift,
            updateUI
        }
    }
}