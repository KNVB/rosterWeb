import { useEffect, useReducer } from "react";
import CalendarUtility from "../util/calendar/CalendarUtility";
import RosterSchedulerData from "../dataUtil/RosterSchedulerData";
import { Utility } from "../util/Utility";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "init":
            result.activeShiftList = action.rosterSchedulerData.activeShiftList;
            result.essentialShift = action.rosterSchedulerData.essentialShift;
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.itoBlackListShiftPattern = action.rosterSchedulerData.itoBlackListShiftPattern;
            result.preferredShiftList = action.rosterSchedulerData.preferredShiftList;
            result.previousMonthShiftList = action.rosterSchedulerData.previousMonthShiftList;
            result.roster = {
                noOfWorkingDay: action.monthlyCalendar.noOfWorkingDay,
                rosterRow: Utility.genITOStat(action.rosterSchedulerData.activeShiftList, action.rosterSchedulerData.rosterData, action.monthlyCalendar.noOfWorkingDay)
            }            
            temp = action.rosterSchedulerData.systemParam;
            temp.monthPickerMinDate = new Date(temp.monthPickerMinDate);
            result.systemParam = temp;
            result.isLoading = false;
            break;
        case "updateRosterMonth":
            result.activeShiftList = action.rosterSchedulerData.activeShiftList;
            result.essentialShift = action.rosterSchedulerData.essentialShift;
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.itoBlackListShiftPattern = action.rosterSchedulerData.itoBlackListShiftPattern;
            result.preferredShiftList = action.rosterSchedulerData.preferredShiftList;
            result.previousMonthShiftList = action.rosterSchedulerData.previousMonthShiftList;
            result.roster = {
                noOfWorkingDay: action.monthlyCalendar.noOfWorkingDay,
                rosterRow: Utility.genITOStat(action.rosterSchedulerData.activeShiftList, action.rosterSchedulerData.rosterData, action.monthlyCalendar.noOfWorkingDay)
            }
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
        activeShiftList: null,
        calendarUtility: new CalendarUtility(),
        calendarDateList: null,
        error: null,
        essentialShift: "",
        isLoading: true,
        itoBlackListShiftPattern: null,
        preferredShiftList: null,
        previousMonthShiftList: null,
        roster: null,
        systemParam: null,
        tableParam: { highLightCellIndex: -1, highLightRowIndex: -1 }
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
            let rosterSchedulerData = await RosterSchedulerData(rosterYear, rosterMonth + 1);
            updateItemList({
                monthlyCalendar,
                rosterSchedulerData,
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
            let rosterSchedulerData = await RosterSchedulerData(rosterYear, rosterMonth + 1);
            updateItemList({
                monthlyCalendar,
                rosterSchedulerData,
                type: "updateRosterMonth"
            });
        }
        catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    let updateUI = (cellIndex, rowIndex) => {

    }
    return {
        activeShiftList: itemList.activeShiftList,
        calendarDateList: itemList.calendarDateList,
        error: itemList.error,
        essentialShift: itemList.essentialShift,
        isLoading: itemList.isLoading,
        itoBlackListShiftPattern: null,
        preferredShiftList: itemList.preferredShiftList,
        previousMonthShiftList: itemList.previousMonthShiftList,
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