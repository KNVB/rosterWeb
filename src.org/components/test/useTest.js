import { useEffect, useReducer } from "react";
import CalendarUtility from "../../util/calendar/CalendarUtility";
import SuperDataUtil from "./SuperDataUtil";
import SystemUtil from "../../util/SystemUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.roster = action.superDataUtil.getRoster();
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.superDataUtil = { ...action.superDataUtil };
            result.systemParam = action.systemParam;
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateRosterMonth":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            break;
        default:
            break;
    }
    return result;
}
export function useTest() {
    const [itemList, updateItemList] = useReducer(reducer, {
        calendarDateList: null,
        calendarUtility: new CalendarUtility(),
        error: null,
        isLoading: true,
        noOfWorkingDay: -1,
        roster: null,
        superDataUtil: null,
        systemParam: null,
    });
    useEffect(() => {
        let systemUtil = new SystemUtil();
        let getData = async () => {
            try {
                let now = new Date();
                let rosterYear = now.getFullYear();
                let rosterMonth = now.getMonth();
                let systemParam = await systemUtil.getSystemParam();
                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
                let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
                let superDataUtil = new SuperDataUtil();
                await superDataUtil.init(itemList.calendarUtility.weekdayNames);
                await superDataUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay, monthlyCalendar.calendarDateList.length);
                //console.log(dataUtil.getRoster());

                updateItemList({
                    monthlyCalendar,
                    superDataUtil,
                    systemParam,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        };
        getData();
    }, []);
    let go = async e => {
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(2023, 1);
        await itemList.superDataUtil.loadData(2023, 2, monthlyCalendar.noOfWorkingDay, monthlyCalendar.calendarDateList.length);
        updateItemList({
            monthlyCalendar,
            type: "updateRosterMonth"
        });
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        roster: itemList.roster,
        uiAction: {
            go
        }
    }
}