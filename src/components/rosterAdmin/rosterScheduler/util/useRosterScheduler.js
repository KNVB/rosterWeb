import { useEffect, useReducer } from "react";
import AutoPlannerUtil from "./AutoPlannerUtil";
import CalendarUtility from "../../../../util/calendar/CalendarUtility";
import KeyboardEventHandler from "./KeyboardEventHandler";
import RosterSchedulerTableUtil from "../../../../util/RosterSchedulerTableUtil";
import RosterSchedulerDataUtil from "../../../../util/RosterSchedulerDataUtil";
import SystemUtil from "../../../../util/SystemUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.autoPlannerUtil.setEndDate(action.monthlyCalendar.calendarDateList.length);
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.systemParam = action.systemParam;
            result.rosterSchedulerTableUtil.init(result.calendarDateList, result.rosterSchedulerDataUtil.getItoIdList(), action.systemParam);
            result.isLoading = false;
            break;
        case "refresh":
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateAutoPlannerResult":
            result.autoPlanResult = action.result;
            result.isLoading = false;
            break;
        case "updateLoading":
            result.isLoading = action.value;
            break;
        case "updateRosterMonth":
            result.autoPlanResult = null;
            result.autoPlannerUtil.setEndDate(action.monthlyCalendar.calendarDateList.length);
            result.autoPlannerUtil.setStartDate(1);
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.rosterSchedulerTableUtil.init(result.calendarDateList, result.rosterSchedulerDataUtil.getItoIdList(), result.systemParam);
            break;
        default:
            break;
    }
    return result;
}
export function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        autoPlannerUtil: new AutoPlannerUtil(),
        autoPlanResult: null,
        calendarDateList: null,
        calendarUtility: new CalendarUtility(),
        error: null,
        isLoading: true,
        noOfWorkingDay: -1,
        rosterSchedulerDataUtil: new RosterSchedulerDataUtil(),
        rosterSchedulerTableUtil: new RosterSchedulerTableUtil(),
        systemParam: null,
    });
    useEffect(() => {
        let systemUtil = new SystemUtil();
        let init = async () => {
            try {
                let now = new Date();
                let rosterYear = now.getFullYear();
                let rosterMonth = now.getMonth();
                let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
                await itemList.rosterSchedulerDataUtil.init(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay, monthlyCalendar.calendarDateList.length, itemList.calendarUtility.weekdayNames);
                let systemParam = await systemUtil.getSystemParam();

                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
                updateItemList({
                    monthlyCalendar,
                    systemParam,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        init();
    }, [itemList.calendarUtility, itemList.rosterSchedulerDataUtil]);
    let { handleKeyDown } = KeyboardEventHandler(itemList, updateItemList);
    let clearAllShiftData = e => {
        itemList.rosterSchedulerDataUtil.clearAllShiftData(itemList.noOfWorkingDay, itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    };
    let copyRosterData = (e) => {
        e.preventDefault();
        let copyRegion = getCopyRegionLocation();
        itemList.rosterSchedulerDataUtil.copy(copyRegion);
        updateItemList({ type: "refresh" });
    }
    let endSelect = () => {
        itemList.rosterSchedulerTableUtil.endSelect();
        updateItemList({ type: "refresh" });
    }
    let exportRosterDataToExcel = async e => {
        try {
            await itemList.rosterSchedulerDataUtil.exportRosterDataToExcel(itemList.calendarDateList);
        } catch (error) {
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let fillEmptyShiftWithO = () => {
        itemList.rosterSchedulerDataUtil.fillEmptyShiftWithO(itemList.calendarDateList.length);
        updateItemList({ "type": "refresh" });
    }
    let getAutoPlanEndDate = () => {
        return itemList.autoPlannerUtil.getEndDate();
    }
    let getAutoPlanIterationCount = () => {
        return itemList.autoPlannerUtil.getIterationCount();
    }
    let getAutoPlanStartDate = () => {
        return itemList.autoPlannerUtil.getStartDate()
    }
    let getCopyRegionLocation = () => {
        let copyRegion = itemList.rosterSchedulerTableUtil.getCopyRegionLocation();
        copyRegion.column.end -= itemList.systemParam.noOfPrevDate;
        copyRegion.column.start -= itemList.systemParam.noOfPrevDate;
        return copyRegion;
    }
    let getEditableShiftCellCssClassName = (cellIndex, rowIndex, shift) => {
        let className = [];
        let temp = itemList.rosterSchedulerDataUtil.getShiftCssClassName(shift);
        if (temp !== null) {
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
    let getShiftCssClassName = shiftType => {
        return itemList.rosterSchedulerDataUtil.getShiftCssClassName(shiftType);
    }
    let isDuplicateShift = (itoId, dateOfMonth) => {
        return itemList.rosterSchedulerDataUtil.isDuplicateShift(itoId, dateOfMonth);
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let pasteRosterData = (dateOfMonth, e) => {
        e.preventDefault();
        let rowCount = itemList.rosterSchedulerDataUtil.getCopyDataRowCount();
        if (rowCount > -1) {
            let cell = e.target.closest("td");
            let rowIds = itemList.rosterSchedulerTableUtil.getPasteRowIds(cell, rowCount);
            itemList.rosterSchedulerDataUtil.paste(dateOfMonth, rowIds, itemList.noOfWorkingDay, itemList.calendarDateList.length);
            updateItemList({ type: "refresh" });
        }
    }
    let saveRosterToDB = async e => {
        try {
            await itemList.rosterSchedulerDataUtil.saveRosterToDB();
            alert("Roster Data is saved to DB successfully.");
        } catch (error) {
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let setFocusCell = e => {
        itemList.rosterSchedulerTableUtil.setFocusCell(e);
        updateItemList({ type: "refresh" });
    }
    let showAutoPlanResult = (index) => {
        itemList.rosterSchedulerDataUtil.loadAutoPlanResult(itemList.autoPlanResult[index], itemList.noOfWorkingDay, itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let startAutoPlan = e => {
        updateItemList({ type: "updateLoading", value: true });
        setTimeout(() => {
            let result = itemList.autoPlannerUtil.autoPlan(itemList.rosterSchedulerDataUtil, itemList.systemParam);
            updateItemList({ "result": result, type: "updateAutoPlannerResult" });
        }, 500);
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
    let updateAutoPlanEndDate = newEndDate => {
        itemList.autoPlannerUtil.setEndDate(newEndDate);
        updateItemList({ type: "refresh" });
    }
    let updateAutoPlanIterationCount = newCount => {
        itemList.autoPlannerUtil.setIterationCount(newCount);
        updateItemList({ type: "refresh" });
    }
    let updateAutoPlanStartDate = newStartDate => {
        itemList.autoPlannerUtil.setStartDate(newStartDate);
        updateItemList({ type: "refresh" });
    }
    let updatePreferredShift = (itoId, dateOfMonth, newPreferredShift) => {
        itemList.rosterSchedulerDataUtil.updatePreferredShift(itoId, dateOfMonth, newPreferredShift);
        updateItemList({ type: "refresh" });
    }
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        try {
            await itemList.rosterSchedulerDataUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay, monthlyCalendar.calendarDateList.length);
            updateItemList({
                monthlyCalendar,
                type: "updateRosterMonth"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updateShift = (itoId, dateOfMonth, newShift) => {
        itemList.rosterSchedulerDataUtil.updateShift(itoId, dateOfMonth, newShift, itemList.noOfWorkingDay, itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterSchedulerTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({ type: "refresh" });
    }
    return {
        autoPlanResult: itemList.autoPlanResult,
        error: itemList.error,
        isLoading: itemList.isLoading,
        roster: itemList.rosterSchedulerDataUtil.getRoster(),
        rosterMonth: {
            calendarDateList: itemList.calendarDateList,
            noOfWorkingDay: itemList.noOfWorkingDay
        },
        rosterSchedulerData: itemList.rosterSchedulerDataUtil.getRosterSchedulerData(),
        systemParam: itemList.systemParam,
        uiAction: {
            clearAllShiftData,
            copyRosterData,
            endSelect,
            exportRosterDataToExcel,
            fillEmptyShiftWithO,
            handleKeyDown,
            isDuplicateShift,
            isHighLightCell,
            isHighLightRow,
            getAutoPlanEndDate,
            getAutoPlanIterationCount,
            getAutoPlanStartDate,
            getEditableShiftCellCssClassName,
            getPreferredShiftCellCssClassName,
            getShiftCssClassName,
            pasteRosterData,
            saveRosterToDB,
            setFocusCell,
            showAutoPlanResult,
            startAutoPlan,
            startSelect,
            updateAutoPlanEndDate,
            updateAutoPlanIterationCount,
            updateAutoPlanStartDate,
            updatePreferredShift,
            updateRosterMonth,
            updateShift,
            updateUI
        }
    }
}