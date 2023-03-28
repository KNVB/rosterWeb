import { useEffect, useReducer } from "react";
import AutoPlanner from "../autoPlanner/AutoPlanner";
import AutoPlannerUtil from "./AutoPlannerUtil";
import CalendarUtility from "../../../util/calendar/CalendarUtility";
import KeyboardEventHandler from "./KeyboardEventHandler";
import RosterDataUtil from "./RosterDataUtil";
import RosterTableUtil from "./RosterTableUtil";
import SystemUtil from "../../../../util/SystemUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.autoPlannerUtil.setEndDate(action.monthlyCalendar.calendarDateList.length);
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.rosterDataUtil = action.rosterDataUtil;
            result.systemParam = action.systemParam;
            result.rosterTableUtil.init(result.calendarDateList, result.rosterDataUtil.getItoIdList(), action.systemParam);
            result.isLoading = false;
            break;
        case "updateRosterMonth":
            result.autoPlannerUtil.setEndDate(action.monthlyCalendar.calendarDateList.length);
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.rosterDataUtil = action.rosterDataUtil;
            result.rosterTableUtil.init(result.calendarDateList, result.rosterDataUtil.getItoIdList(), result.systemParam);
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
    const [itemList, updateItemList] = useReducer(reducer,
        {
            autoPlannerUtil: new AutoPlannerUtil(),
            calendarUtility: new CalendarUtility(),
            calendarDateList: null,
            error: null,
            isLoading: true,
            noOfWorkingDay: -1,
            rosterDataUtil: null,
            rosterTableUtil: new RosterTableUtil(),
            systemParam: null
        });
    useEffect(() => {
        let rosterDataUtil = new RosterDataUtil();
        let systemUtil = new SystemUtil();
        let init = async () => {
            try {
                let now = new Date();
                let rosterYear = now.getFullYear();
                let rosterMonth = now.getMonth();
                let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
                await rosterDataUtil.init(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay, monthlyCalendar.calendarDateList.length);
                let systemParam = await systemUtil.getSystemParam();
                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
                updateItemList({
                    monthlyCalendar,
                    rosterDataUtil,
                    systemParam,
                    type: "init"
                });
            } catch (error) {
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        init();
    }, []);
    let { handleKeyDown } = KeyboardEventHandler(itemList, updateItemList);
    let copy = e => {
        e.preventDefault();
        let copyRegion = getCopyRegionLocation();
        itemList.rosterDataUtil.copy(copyRegion);
        updateItemList({ type: "refresh" });
    }
    let endSelect = () => {
        itemList.rosterTableUtil.endSelect();
        updateItemList({ type: "refresh" });
    }
    let fillEmptyShiftWithO = () => {
        itemList.rosterDataUtil.fillEmptyShiftWithO(itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let getCopyRegionLocation = () => {
        let copyRegion = itemList.rosterTableUtil.getCopyRegionLocation();
        copyRegion.column.end -= itemList.systemParam.noOfPrevDate;
        copyRegion.column.start -= itemList.systemParam.noOfPrevDate;
        return copyRegion;
    }
    let getEditableShiftCellCssClassName = (cellIndex, rowIndex, shift) => {
        let className = [];
        let temp = itemList.rosterDataUtil.getShiftCssClassName(shift);
        if (temp !== null) {
            className.push(temp);
        }
        temp = itemList.rosterTableUtil.getSelectedCssClass(cellIndex, rowIndex);
        if (temp.length > 0) {
            className.push(...temp);
        }
        return className;
    }
    let getPreferredShiftCellCssClassName = (cellIndex, rowIndex) => {
        let className = ["borderCell", "shiftCell"];
        let temp = itemList.rosterTableUtil.getSelectedCssClass(cellIndex, rowIndex);
        if (temp.length > 0) {
            className.push(...temp);
        }
        return className;
    }

    let getShiftCssClassName = shiftType => {
        return itemList.rosterDataUtil.getShiftCssClassName(shiftType);
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterTableUtil.isHighLightRow(rowIndex);
    }
    let paste = (dateOfMonth, e) => {
        e.preventDefault();
        let rowCount = itemList.rosterDataUtil.getCopyDataRowCount();
        if (rowCount > -1) {
            let cell = e.target.closest("td");
            let rowIds = itemList.rosterTableUtil.getPasteRowIds(cell, rowCount);
            itemList.rosterDataUtil.paste(dateOfMonth, rowIds, itemList.noOfWorkingDay, itemList.calendarDateList.length);
            updateItemList({ type: "refresh" });
        }
    }
    let setFocusCell = e => {
        itemList.rosterTableUtil.setFocusCell(e);
        updateItemList({ type: "refresh" });
    }
    let startAutoPlan = e => {
        itemList.autoPlannerUtil.autoPlan(itemList.rosterDataUtil);
        updateItemList({ type: "refresh" });
    }
    let startSelect = e => {
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        //console.log(cell.cellIndex, rowIndex)
        e.preventDefault();
        itemList.rosterTableUtil.selectCell(cell.cellIndex, rowIndex);
        itemList.rosterTableUtil.startSelect(cell.cellIndex, rowIndex);
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
        itemList.rosterDataUtil.updatePreferredShift(itoId, dateOfMonth, newPreferredShift);
        updateItemList({ type: "refresh" });
    }
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        let rosterDataUtil = { ...itemList.rosterDataUtil };
        await rosterDataUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay);
        updateItemList({
            monthlyCalendar,
            rosterDataUtil,
            type: "updateRosterMonth"
        });
    }
    let updateShift = (itoId, dateOfMonth, newShift) => {
        itemList.rosterDataUtil.updateShift(itoId, dateOfMonth, newShift, itemList.noOfWorkingDay, itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({ type: "refresh" });
    }
    return {
        autoPlannerUtil: itemList.autoPlannerUtil,
        error: itemList.error,
        isLoading: itemList.isLoading,
        rosterMonth: {
            calendarDateList: itemList.calendarDateList,
            noOfWorkingDay: itemList.noOfWorkingDay
        },
        rosterDataUtil: itemList.rosterDataUtil,
        systemParam: itemList.systemParam,
        uiAction: {
            copy,
            endSelect,
            fillEmptyShiftWithO,
            handleKeyDown,
            getEditableShiftCellCssClassName,
            getPreferredShiftCellCssClassName,
            getShiftCssClassName,
            isHighLightCell,
            isHighLightRow,
            paste,
            setFocusCell,
            startAutoPlan,
            startSelect,
            updateAutoPlanEndDate,
            updateAutoPlanIterationCount,
            updateAutoPlanStartDate,
            updatePreferredShift,
            updateRosterMonth,
            updateShift,
            updateUI
        },
        weekdayNames: itemList.calendarUtility.weekdayNames
    }
}