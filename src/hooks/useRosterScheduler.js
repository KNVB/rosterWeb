import { useEffect, useReducer } from "react";
import KeyboardEventHandler from "../util/KeyboardEventHandler";
import RosterSchedulerData from "../dataUtil/RosterSchedulerData";
import RosterSchedulerTableUtil from "../dataUtil/RosterSchedulerTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "hideTimeOff":
            result.isShowTimeOff = false;
            break;
        case "init":
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.rosterSchedulerTableUtil.init(
                action.rosterSchedulerData.calendarDateList,
                action.rosterSchedulerData.itoIdList,
                action.rosterSchedulerData.systemParam);
            result.isLoading = false;
            break;
        case "refresh":
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "showTimeOff":
            result.isShowTimeOff = true;
            result.selectedITOId = action.itoId;
            break;
        case "updateLoading":
            result.isLoading = action.value;
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
        isShowTimeOff: false,
        keyboardEventHandler: null,
        rosterSchedulerData: null,
        rosterSchedulerTableUtil: new RosterSchedulerTableUtil(),
        selectedITOId: null
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterSchedulerData = new RosterSchedulerData();
            try {
                await rosterSchedulerData.load(rosterYear, rosterMonth);
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
    let copyRosterData = (e) => {
        e.preventDefault();
        let copyRegion = itemList.rosterSchedulerTableUtil.getCopyRegionLocation();
        copyRegion.column.end -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        copyRegion.column.start -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        itemList.rosterSchedulerData.copy(copyRegion);
        updateItemList({ type: "refresh" });
    }
    let endSelect = () => {
        itemList.rosterSchedulerTableUtil.endSelect();
        updateItemList({ type: "refresh" });
    }
    let getEditableShiftCellCssClassName = (cellIndex, rowIndex, shift) => {
        let className = [];
        let temp = getShiftCssClassName(shift);
        if (temp !== "") {
            className.push(temp);
        }
        temp = itemList.rosterSchedulerTableUtil.getSelectedCssClass(cellIndex, rowIndex);
        if (temp.length > 0) {
            className.push(...temp);
        }
        return className;
    }
    let getPreferredShiftCellCssClassName = (cellIndex, rowIndex) => {
        let className = [];
        let temp = itemList.rosterSchedulerTableUtil.getSelectedCssClass(cellIndex, rowIndex);
        if (temp.length > 0) {
            className.push(...temp);
        }
        return className;
    }
    let getRowIndex = rowName => {
        return itemList.rosterSchedulerTableUtil.getRowIndex(rowName);
    }
    let getShiftCssClassName = shiftType => {
        return itemList.rosterSchedulerData.getShiftCssClassName(shiftType);
    }
   
    let { handleKeyDown } = KeyboardEventHandler(itemList, updateItemList);
    let hideTimeOff = () => {
        updateItemList({
            "type": "hideTimeOff"
        });
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let pasteRosterData = (dateOfMonth, e) => {
        e.preventDefault();
        let rowCount = itemList.rosterSchedulerData.getCopyDataRowCount();
        if (rowCount > -1) {
            let selectedLocation = itemList.rosterSchedulerTableUtil.getSelectedLocation();
            itemList.rosterSchedulerData.paste(
                dateOfMonth,
                itemList.rosterSchedulerTableUtil.rosterRowIdList,
                selectedLocation);
            updateItemList({ type: "refresh" });
        }
    }
    let setFocusCell = e => {
        itemList.rosterSchedulerTableUtil.setFocusCell(e);
        updateItemList({ type: "refresh" });
    }
    let showTimeOff = itoId => {
        
        updateItemList({
            itoId,
            "type": "showTimeOff"
        });
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
    let updatePreferredShift = (itoId, dateOfMonth, shift) => {
        itemList.rosterSchedulerData.updatePreferredShift(itoId, dateOfMonth, shift);
        updateItemList({
            type: "refresh"
        });
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
    let updateShift = (itoId, dateOfMonth, shift) => {
        itemList.rosterSchedulerData.updateShift(itoId, dateOfMonth, shift);
        updateItemList({
            type: "refresh"
        });
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterSchedulerTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({
            type: "refresh"
        });
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        isShowTimeOff: itemList.isShowTimeOff,
        rosterSchedulerData: itemList.rosterSchedulerData,
        selectedITOId: itemList.selectedITOId,
        "uiAction": {
            copyRosterData,
            endSelect,
            getEditableShiftCellCssClassName,
            getPreferredShiftCellCssClassName,
            getRowIndex,
            getShiftCssClassName,           
            handleKeyDown,
            hideTimeOff,
            isHighLightCell,
            isHighLightRow,
            pasteRosterData,
            showTimeOff,
            setFocusCell,
            startSelect,
            updatePreferredShift,
            updateRosterMonth,
            updateShift,
            updateUI
        }
    }
}