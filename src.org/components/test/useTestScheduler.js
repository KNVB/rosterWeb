import { useEffect, useReducer } from "react";
import CalendarUtility from "../../util/calendar/CalendarUtility";
import RosterSchedulerUtil from "./RosterSchedulerUtil";
import SystemUtil from "../../util/SystemUtil";

let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.monthlyCalendar = action.monthlyCalendar;
            result.roster = action.rosterSchedulerUtil.getRoster();
            result.rosterSchedulerData = action.rosterSchedulerUtil.getRosterSchedulerData();
            result.rosterSchedulerUtil = action.rosterSchedulerUtil;
            result.systemParam = action.systemParam;
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateRosterMonth":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.roster = result.rosterSchedulerUtil.getRoster();
            result.rosterSchedulerData = result.rosterSchedulerUtil.getRosterSchedulerData();
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            break;
        default:
            break;
    }
    return result;
}
export function useTestScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        calendarDateList: null,
        calendarUtility: new CalendarUtility(),
        monthlyCalendar: null,
        error: null,
        isLoading: true,
        roster: null,
        rosterSchedulerData: null,
        rosterSchedulerUtil: null,
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
                systemParam.noOfPrevDate = 0;
                let rosterSchedulerUtil = new RosterSchedulerUtil();
                await rosterSchedulerUtil.init(itemList.calendarUtility.weekdayNames);
                await rosterSchedulerUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.calendarDateList.length, monthlyCalendar.noOfWorkingDay);
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
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        try {
            await itemList.rosterSchedulerUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.calendarDateList.length, monthlyCalendar.noOfWorkingDay,);
            updateItemList({
                monthlyCalendar,
                type: "updateRosterMonth"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        roster: itemList.roster,
        rosterSchedulerData: itemList.rosterSchedulerData,
        systemParam: itemList.systemParam,
        uiAction: {
            updateRosterMonth
        }
    }
}