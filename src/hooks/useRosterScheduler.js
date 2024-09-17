import { useEffect, useReducer } from "react";
import KeyboardEventHandler from "../util/KeyboardEventHandler.js";
import RosterSchedulerData from "../dataUtil/RosterSchedulerData";
import RosterSchedulerTableUtil from "../dataUtil/RosterSchedulerTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "hideShiftDetail":
            result.isShowShiftDetail = false;
            result.shiftDetail = null;
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
        case "showShiftDetail":
            result.isShowShiftDetail = true;
            result.shiftDetail = action.shiftDetail;
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
        case "updateShiftDetailDesc":
            result.shiftDetail.description = action.value;
            break
        case "updateShiftDetailEndTime":
            result.shiftDetail.timeOffEnd = action.value;
            result.shiftDetail.timeOffAmount = action.timeOffAmount;
            break;
        case "updateShiftDetailShiftType":
            result.shiftDetail.shiftType = action.value;
            break;
        case "updateShiftDetailStartTime":
            result.shiftDetail.timeOffStart = action.value;
            result.shiftDetail.timeOffAmount = action.timeOffAmount;
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
        isShowShiftDetail: false,
        keyboardEventHandler: null,
        rosterSchedulerData: null,
        rosterSchedulerTableUtil: new RosterSchedulerTableUtil(),
        shiftDetail: null
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
    let deleteSelectedData=()=>{
        let selectedLocation = itemList.rosterSchedulerTableUtil.getSelectedLocation();
        selectedLocation.column.end -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        selectedLocation.column.start -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        itemList.rosterSchedulerData.deleteSelectedData(
            selectedLocation,
            itemList.rosterSchedulerData.noOfWorkingDay,
            itemList.rosterSchedulerData.calendarDateList.length);
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

    let { handleKeyDown } = KeyboardEventHandler();
    let handleBlur = (newShift, itoId, date) => {
        newShift = newShift.trim();
        itemList.rosterSchedulerData.updateShift(itoId, date, newShift);
        updateItemList({ type: "refresh" });
    }
    let handleEscKeyEvent=()=>{
        itemList.rosterSchedulerTableUtil.clearCopiedRegion();
        itemList.rosterSchedulerData.clearCopiedData();
        updateItemList({ type: "refresh" });
    }
    let handleArrowKeyEvent = (cell, xOffset, yOffset) => {
        let nextCell = itemList.rosterSchedulerTableUtil.getNextCell(cell, xOffset, yOffset);
        itemList.rosterSchedulerTableUtil.selectCell(nextCell.cellIndex, nextCell.rowIndex);
        itemList.rosterSchedulerTableUtil.select(nextCell.cellIndex, nextCell.rowIndex);
        updateItemList({ type: "refresh" });
    }
    let hideShiftDetail = () => {
        updateItemList({
            "type": "hideShiftDetail"
        });
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let isSingleCellSelected = () => {
        return (itemList.rosterSchedulerTableUtil.isFirstInput())
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
    let reDo=()=>{
        itemList.rosterSchedulerData.reDo();
        updateItemList({ type: "refresh" });
    }
    let setFocusCell = e => {
        itemList.rosterSchedulerTableUtil.setFocusCell(e);
        updateItemList({ type: "refresh" });
    }
    let showShiftDetail = (itoId, date) => {
        let temp = itemList.rosterSchedulerData.getShiftDetail(itoId, date);
        updateItemList({
            shiftDetail: temp,
            "type": "showShiftDetail"
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
    let unDo=()=>{
        itemList.rosterSchedulerData.unDo();
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
    let updateShift = (itoId, dateOfMonth, element) => {
        let shift = element.textContent;
        let shiftDetail = itemList.rosterSchedulerData.updateShift(itoId, dateOfMonth, shift);
        if (shiftDetail) {
            element.textContent = shiftDetail.oldShift;
            updateItemList({
                shiftDetail,
                "type": "showShiftDetail"
            });
        } else {
            updateItemList({
                type: "refresh"
            });
        }
    }
    let updateShiftDetail = () => {
        itemList.rosterSchedulerData.updateShiftDetail(itemList.shiftDetail);
        console.log(itemList.rosterSchedulerData);
        updateItemList({
            type: "hideShiftDetail"
        });
    }
    let updateShiftDetailDesc = newDesc => {
        updateItemList({
            type: "updateShiftDetailDesc",
            value: newDesc
        });
    }
    let updateShiftDetailShiftType = newShiftType => {
        updateItemList({
            type: "updateShiftDetailShiftType",
            value: newShiftType
        });
    }
    let updateShiftDetailEndTime = newEndTime => {
        let timeOffAmount = ((newEndTime - itemList.shiftDetail.timeOffStart) / 1000 / 60 / 60).toFixed(2);
        updateItemList({
            timeOffAmount,
            type: "updateShiftDetailEndTime",
            value: newEndTime
        });
    }

    let updateShiftDetailStartTime = newStartTime => {
        let timeOffAmount = ((itemList.shiftDetail.timeOffEnd - newStartTime) / 1000 / 60 / 60).toFixed(2)
        updateItemList({
            timeOffAmount,
            type: "updateShiftDetailStartTime",
            value: newStartTime
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
        isShowShiftDetail: itemList.isShowShiftDetail,
        rosterSchedulerData: itemList.rosterSchedulerData,
        shiftDetail: itemList.shiftDetail,
        "uiAction": {
            copyRosterData,
            deleteSelectedData,
            endSelect,
            getEditableShiftCellCssClassName,
            getPreferredShiftCellCssClassName,
            getRowIndex,            
            getShiftCssClassName,
            handleBlur,
            handleEscKeyEvent,
            handleKeyDown,
            handleArrowKeyEvent,
            hideShiftDetail,
            isHighLightCell,
            isHighLightRow,
            isSingleCellSelected,
            pasteRosterData,
            reDo,
            setFocusCell,
            showShiftDetail,
            startSelect,
            unDo,
            updatePreferredShift,
            updateRosterMonth,
            updateShift,
            updateShiftDetail,
            updateShiftDetailDesc,
            updateShiftDetailEndTime,
            updateShiftDetailShiftType,
            updateShiftDetailStartTime,
            updateUI
        }
    }
}