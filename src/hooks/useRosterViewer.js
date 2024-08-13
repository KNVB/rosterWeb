import { useEffect, useReducer } from "react";
import CalendarUtility from "../util/calendar/CalendarUtility";
import RosterViewerData from "../dataUtil/RosterViewerData";
import { Utility } from "../util/Utility";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "init":
            result.activeShiftList = action.rosterViewerData.activeShiftList;
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.roster = {
                noOfWorkingDay: action.monthlyCalendar.noOfWorkingDay,
                rosterRow: Utility.genITOStat(action.rosterViewerData.activeShiftList, action.rosterViewerData.rosterData, action.monthlyCalendar.noOfWorkingDay)
            }
            console.log(action.rosterViewerData)
            temp = action.rosterViewerData.systemParam;
            temp.monthPickerMinDate = new Date(temp.monthPickerMinDate);
            result.systemParam = temp;
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
                rosterRow: Utility.genITOStat(result.activeShiftList, action.rosterViewerData.rosterData, action.monthlyCalendar.noOfWorkingDay)
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
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
            let rosterViewerData = await RosterViewerData(rosterYear, rosterMonth + 1);
            updateItemList({
                monthlyCalendar,
                rosterViewerData,
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
            let rosterViewerData = await RosterViewerData(rosterYear, rosterMonth + 1);
            updateItemList({
                rosterViewerData,
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
        "uiAction": {
            getShiftCssClassName,
            isHighLightCell,
            isHighLightRow,
            updateRosterMonth,
            updateUI
        }
    }
}