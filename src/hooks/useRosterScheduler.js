import { useEffect, useReducer } from "react";
import CalendarUtility from "../util/calendar/CalendarUtility";
import KeyboardEventHandler from "../util/KeyboardEventHandler";
import RosterSchedulerUtil from "../dataUtil/RosterSchedulerUtil";
import SystemUtil from "../dataUtil/SystemUtil";
import RosterSchedulerTableUtil  from "../dataUtil/RosterSchedulerTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.monthlyCalendar = action.monthlyCalendar;
            result.roster = action.rosterSchedulerUtil.getRoster();
            result.rosterSchedulerData = action.rosterSchedulerUtil.getRosterSchedulerData();
            result.rosterSchedulerUtil = action.rosterSchedulerUtil;
            result.systemParam = action.systemParam;
            result.isLoading = false;
            break;
        case "refresh":
            result.roster = result.rosterSchedulerUtil.getRoster();
            result.rosterSchedulerData = result.rosterSchedulerUtil.getRosterSchedulerData();
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateRosterMonth":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.roster = result.rosterSchedulerUtil.getRoster();
            result.rosterSchedulerData = result.rosterSchedulerUtil.getRosterSchedulerData();
            break;
        default:
            break;
    }
    return result;
}
export function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        calendarDateList: null,
        calendarUtility: new CalendarUtility(),
        monthlyCalendar: null,
        error: null,
        isLoading: true,
        noOfWorkingDay: -1,
        roster: null,
        rosterSchedulerData: null,
        rosterSchedulerUtil: null,
        rosterSchedulerTableUtil: new RosterSchedulerTableUtil(),
        systemParam: null,
    });
    useEffect(() => {
        let systemUtil = new SystemUtil();
        let getData = async () => {
            try {
                let now = new Date();
                let rosterYear = now.getFullYear();
                let rosterMonth = now.getMonth();
                let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
                let systemParam = await systemUtil.getSystemParam();
                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);

                let rosterSchedulerUtil = new RosterSchedulerUtil();
                await rosterSchedulerUtil.init(itemList.calendarUtility.weekdayNames);
                await rosterSchedulerUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay, monthlyCalendar.calendarDateList.length);                                                  
                updateItemList({
                    monthlyCalendar,
                    rosterSchedulerUtil,
                    systemParam,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    //==============================================================================================================================        
    let { handleKeyDown } = KeyboardEventHandler(itemList, updateItemList);
    let clearAllShiftData = e => {
        itemList.rosterSchedulerUtil.clearAllShiftData(itemList.noOfWorkingDay, itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    };
    let copyRosterData = (e) => {
        e.preventDefault();
        let copyRegion = getCopyRegionLocation();
        itemList.rosterSchedulerUtil.copy(copyRegion);
        updateItemList({ type: "refresh" });
    }
    let endSelect = () => {
        itemList.rosterSchedulerTableUtil.endSelect();
        updateItemList({ type: "refresh" });
    }
    let getCopyRegionLocation = () => {
        let copyRegion = itemList.rosterSchedulerTableUtil.getCopyRegionLocation();
        copyRegion.column.end -= itemList.systemParam.noOfPrevDate;
        copyRegion.column.start -= itemList.systemParam.noOfPrevDate;
        return copyRegion;
    }
    let getEditableShiftCellCssClassName = (cellIndex, rowIndex, shift) => {
        let className = [];
        let temp = itemList.rosterSchedulerUtil.getShiftCssClassName(shift);
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
        return itemList.rosterSchedulerUtil.getShiftCssClassName(shiftType);
    }
    let isDuplicateShift = (itoId, dateOfMonth) => {
        return itemList.rosterSchedulerUtil.isDuplicateShift(itoId, dateOfMonth);
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let pasteRosterData = (dateOfMonth, e) => {
        e.preventDefault();
        let rowCount = itemList.rosterSchedulerUtil.getCopyDataRowCount();
        if (rowCount > -1) {
            let cell = e.target.closest("td");
            let rowIds = itemList.rosterSchedulerTableUtil.getPasteRowIds(cell, rowCount);
            itemList.rosterSchedulerUtil.paste(dateOfMonth, rowIds, itemList.noOfWorkingDay, itemList.calendarDateList.length);
            updateItemList({ type: "refresh" });
        }
    }
    let setFocusCell = e => {
        itemList.rosterSchedulerTableUtil.setFocusCell(e);
        updateItemList({ type: "refresh" });
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
    let updatePreferredShift = (itoId, dateOfMonth, newPreferredShift) => {
        itemList.rosterSchedulerUtil.updatePreferredShift(itoId, dateOfMonth, newPreferredShift);
        updateItemList({ type: "refresh" });
    }
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        try {
            await itemList.rosterSchedulerUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay);
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
        itemList.rosterSchedulerUtil.updateShift(itoId, dateOfMonth, newShift, itemList.noOfWorkingDay, itemList.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterSchedulerTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({ type: "refresh" });
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        roster: itemList.roster,
        rosterMonth: {
            calendarDateList: itemList.calendarDateList,
            noOfWorkingDay: itemList.noOfWorkingDay
        },
        rosterSchedulerData: itemList.rosterSchedulerData,
        systemParam: itemList.systemParam,
        uiAction: {
            clearAllShiftData,
            copyRosterData,
            endSelect,
            getEditableShiftCellCssClassName,
            getPreferredShiftCellCssClassName,
            getShiftCssClassName,
            handleKeyDown,
            isDuplicateShift,
            isHighLightCell,
            isHighLightRow,
            pasteRosterData,
            setFocusCell,
            startSelect,
            updatePreferredShift,
            updateRosterMonth,
            updateShift,
            updateUI
        }
    }
}