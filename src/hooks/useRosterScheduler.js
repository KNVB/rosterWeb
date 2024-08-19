import { useEffect, useReducer } from "react";
import RosterSchedulerData from "../dataUtil/RosterSchedulerData";
import RosterSchedulerTableUtil from "../dataUtil/RosterSchedulerTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.isLoading = false;
            break;
        case "refresh":
            break;
        case "setError":
            result.error = action.error;
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
        rosterSchedulerData: null,
        rosterSchedulerTableUtil:new RosterSchedulerTableUtil(),       
        systemParam: null,
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
    let getShiftCssClassName = shiftType => {
        return itemList.rosterSchedulerData.getShiftCssClassName(shiftType);
    }
    let getEditableShiftCellCssClassName=(cellIndex, rowIndex, shift)=>{
        let className = [];
        let temp=getShiftCssClassName(shift);
        if (temp!==""){
            className.push(temp);
        }
        return className;
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let updateRosterMonth = async (newRosterMonth) => {
        try {
            await itemList.rosterSchedulerData.reload(newRosterMonth);
            updateItemList({
                type: "refresh"
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
            getEditableShiftCellCssClassName,
            getShiftCssClassName,
            isHighLightCell,
            isHighLightRow,
            updateRosterMonth,
            updateShift,
            updateUI
        }
    }
}