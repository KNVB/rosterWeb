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
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.roster = {
                noOfWorkingDay: action.monthlyCalendar.noOfWorkingDay,
                rosterRow: Utility.genITOStat(action.rosterSchedulerData.activeShiftList, action.rosterSchedulerData.rosterData, action.monthlyCalendar.noOfWorkingDay)
            }
            console.log(action.rosterSchedulerData)
            temp = action.rosterSchedulerData.systemParam;
            temp.monthPickerMinDate = new Date(temp.monthPickerMinDate);
            result.systemParam = temp;
            result.isLoading = false;
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
        isLoading: true,
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
    }, [])
    return {
        activeShiftList: itemList.activeShiftList,
        calendarDateList: itemList.calendarDateList,
        error: itemList.error,
        isLoading: itemList.isLoading,
        roster: itemList.roster,
        systemParam: itemList.systemParam,
    }
}