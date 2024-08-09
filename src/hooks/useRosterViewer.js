import { useEffect, useReducer } from "react";
import ActiveShiftList from "../dataUtil/ActiveShiftList";
import CalendarUtility from "../util/calendar/CalendarUtility";
import Roster from "../dataUtil/Roster";
import SystemParam from "../dataUtil/SystemParam";
import { Utility } from "../util/Utility";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.activeShiftList = action.activeShiftList;
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.roster = {
                noOfWorkingDay: action.monthlyCalendar.noOfWorkingDay,
                rosterRow: Utility.genITOStat(action.activeShiftList, action.roster, action.monthlyCalendar.noOfWorkingDay)
            }
            result.systemParam = action.systemParam;
            result.isLoading = false;
            break;
        case "refresh":
            result.tableParam = {
                highLightCellIndex: action.cellIndex,
                highLightRowIndex: action.rowIndex
            }
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateRosterMonth":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.roster = {
                noOfWorkingDay: action.monthlyCalendar.noOfWorkingDay,
                rosterRow: Utility.genITOStat(result.activeShiftList, action.roster, action.monthlyCalendar.noOfWorkingDay)
            }
            result.roster.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            break
        default:
            break;
    }
    return result;
}
export function useRosterViewer() {
    const [itemList, updateItemList] = useReducer(reducer, {
        activeShiftList: null,
        calendarUtility: new CalendarUtility(),
        calendarDateList: null,
        error: null,
        isLoading: true,
        roster: null,
        systemParam: null,
        tableParam: { highLightCellIndex: -1, highLightRowIndex: -1 },
        uiAction: null,
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
            let activeShiftList = await ActiveShiftList();
            let roster = await Roster(rosterYear, rosterMonth + 1);
            let systemParam = await SystemParam();
            systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
            systemParam.noOfPrevDate = 0;
            updateItemList({
                activeShiftList,
                monthlyCalendar,
                roster,
                systemParam,
                type: "init"
            });
        }
        getData();
    }, []);
    let getShiftCssClassName = shiftType => {
        return itemList.activeShiftList[shiftType].cssClassName;
    }
    let isHighLightCell = cellIndex => {
        return (itemList.tableParam.highLightCellIndex === cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return (itemList.tableParam.highLightRowIndex === rowIndex);
    }
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        try {
            let roster = await Roster(rosterYear, rosterMonth + 1);
            updateItemList({
                roster,
                monthlyCalendar,
                type: "updateRosterMonth"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updateUI = (cellIndex, rowIndex) => {
        updateItemList({ cellIndex, rowIndex, type: "refresh" });
    }
    return {
        activeShiftList: itemList.activeShiftList,
        calendarDateList: itemList.calendarDateList,
        error: itemList.error,
        isLoading: itemList.isLoading,
        roster: itemList.roster,
        systemParam: itemList.systemParam,
        uiAction: {
            getShiftCssClassName,
            isHighLightCell,
            isHighLightRow,
            updateRosterMonth,
            updateUI
        }
    }
}