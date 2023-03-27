import { useEffect, useReducer } from "react";
import CalendarUtility from "../../../util/calendar/CalendarUtility";
import RosterDataUtil from "./RosterDataUtil";
import RosterTableUtil from "./RosterTableUtil";
import SystemUtil from "../../../../util/SystemUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "copy":
            result.rosterDataUtil.copy(action.copyRegion);
            break;
        case "endSelect":
            result.rosterTableUtil.endSelect();
            break;
        case "init":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.rosterDataUtil = action.rosterDataUtil;
            result.systemParam = action.systemParam;
            result.rosterTableUtil.init(result.calendarDateList, result.rosterDataUtil.getItoIdList(), action.systemParam);
            result.isLoading = false;
            break;
        case "updateRosterMonth":
            result.history=action.history;
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.rosterDataUtil = action.rosterDataUtil;
            result.rosterTableUtil.init(result.calendarDateList, result.rosterDataUtil.getItoIdList(), result.systemParam);
            break;
        case "updateShift":
            result.rosterDataUtil.updateShift(action.itoId, action.dateOfMonth, action.newShift, result.noOfWorkingDay, result.calendarDateList.length);
            break;
        case "updateUI":
            result.rosterTableUtil.updateUI(action.cellIndex, action.rowIndex);
            break;
        case "selectNextCell":
            result.rosterTableUtil.selectCell(action.cellIndex, action.rowIndex);
            result.rosterTableUtil.select(action.cellIndex, action.rowIndex);
            break;
        case "setError":
            result.error = action.error;
            break;
        case "startSelect":
            result.rosterTableUtil.selectCell(action.cellIndex, action.rowIndex);
            result.rosterTableUtil.startSelect(action.cellIndex, action.rowIndex);
            break
        default:
            break;
    }
    return result;
}
export function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer,
        {
            calendarUtility: new CalendarUtility(),
            calendarDateList: null,
            error: null,
            isLoading: true,
            noOfWorkingDay: -1,
            rosterDataUtil: null,            
            rosterTableUtil: new RosterTableUtil(),
            systemParam: null
        });
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

    let copy = e => {
        e.preventDefault();
        let copyRegion = itemList.rosterTableUtil.getCopyRegionLocation();
        copyRegion.column.end -= itemList.systemParam.noOfPrevDate;
        copyRegion.column.start -= itemList.systemParam.noOfPrevDate;
        updateItemList({ copyRegion: copyRegion, type: "copy" });
    }
    let endSelect = () => {
        updateItemList({ type: "endSelect" });
    }
    let handleArrowKeyEvent = (e, yOffset, xOffset) => {
        e.preventDefault();
        let cell = e.target.closest("td");
        let nextCell = itemList.rosterTableUtil.getNextCell(cell, yOffset, xOffset);
        updateItemList({ cellIndex: nextCell.cellIndex, rowIndex: nextCell.rowIndex, "type": "selectNextCell" });
    }
    let handleKeyDown = e => {
        if (itemList.rosterTableUtil.isFirstInput()) {
            switch (e.key) {
                case "ArrowDown"://handle down arrow key event
                    handleArrowKeyEvent(e, 1, 0);
                    break;
                case "ArrowLeft"://handle left arrow key event
                    handleArrowKeyEvent(e, 0, -1);
                    break;
                case "ArrowRight"://handle right arrow key event
                    handleArrowKeyEvent(e, 0, 1);
                    break;
                case "ArrowUp"://handle up arrow key event
                    handleArrowKeyEvent(e, -1, 0);
                    break;
                case "Tab"://handle tab key
                    if (e.shiftKey) {
                        handleArrowKeyEvent(e, 0, -1);
                    } else {
                        handleArrowKeyEvent(e, 0, 1);
                    }
                    break;
                case "y":
                    if (e.ctrlKey){
                        e.preventDefault();
                        itemList.rosterDataUtil.reDo();
                        updateItemList({ type:"refresh"});
                    }
                    break;
                case "z":
                    if (e.ctrlKey){
                        e.preventDefault();
                        itemList.rosterDataUtil.unDo();
                        updateItemList({ type:"refresh"});
                    }
                    break;
                default:
                    break
            }
        }
    }
    let getEditableShiftCellCssClassName = (cellIndex, rowIndex, shift) => {
        let className = ["borderCell", "shiftCell", itemList.rosterDataUtil.getShiftCssClassName(shift)];
        let temp = itemList.rosterDataUtil.getShiftCssClassName(shift);
        if (temp !== undefined) {
            className.push(temp);
        }
        temp = itemList.rosterTableUtil.getSelectedCssClass(cellIndex, rowIndex);
        if (temp.length > 0) {
            className.push(...temp);
        }
        return className;
    }
    let getPreferredShiftCellCssClassName = (cellIndex, rowIndex) => { }
    let getShiftCssClassName = shiftType => { }
    let isHighLightCell = cellIndex => {
        return itemList.rosterTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterTableUtil.isHighLightRow(rowIndex);
    }
    let paste = (dateOfMonth, e) => {
        e.preventDefault();        
        let rowCount=itemList.rosterDataUtil.getCopyDataRowCount();
        if (rowCount > -1){
            let cell = e.target.closest("td");
            let rowIds=itemList.rosterTableUtil.getPasteRowIds(cell,rowCount);
            itemList.rosterDataUtil.paste(dateOfMonth,rowIds, itemList.noOfWorkingDay,itemList.calendarDateList.length);
            updateItemList({ type:"refresh"});
        }
    }
    let setFocusCell = e => { }
    let startSelect = e => {
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        //console.log(cell.cellIndex, rowIndex)
        e.preventDefault();
        updateItemList({
            cellIndex: cell.cellIndex,
            rowIndex: rowIndex,
            type: "startSelect"
        });
    }
    let updatePreferredShift = (itoId, dateOfMonth, newShift) => { }
    let updateShift = (itoId, dateOfMonth, newShift) => {        
        updateItemList({ itoId: itoId, dateOfMonth: dateOfMonth, newShift: newShift, type: "updateShift" });
    }
    let updateUI = (cellIndex, rowIndex) => {
        updateItemList({ cellIndex: cellIndex, rowIndex: rowIndex, type: "updateUI" });
    }
    return {
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
            handleKeyDown,
            getEditableShiftCellCssClassName,
            getPreferredShiftCellCssClassName,
            getShiftCssClassName,
            isHighLightCell,
            isHighLightRow,
            paste,
            setFocusCell,
            startSelect,
            updatePreferredShift,
            updateRosterMonth,
            updateShift,
            updateUI
        },
        weekdayNames: itemList.calendarUtility.weekdayNames
    }
}