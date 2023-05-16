import { useEffect, useReducer } from "react";
import CalendarUtility from "../../util/calendar/CalendarUtility";
import RosterDataUtil from "./RosterDataUtill";
import SystemUtil from "../../util/SystemUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.monthlyCalendar = action.monthlyCalendar;
            result.roster = action.rosterDataUtil.getRoster();
            result.rosterDataUtil = action.rosterDataUtil;
            result.systemParam = action.systemParam;
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        default:
            break;
    }
    return result;
}
export function useTestRoster() {
    const [itemList, updateItemList] = useReducer(reducer, {
        calendarUtility: new CalendarUtility(),
        monthlyCalendar: null,
        error: null,
        isLoading: true,
        roster: null,
        rosterDataUtil: null,
        systemParam: null,
    });
    useEffect(() => {
        let systemUtil = new SystemUtil();
        let getData = async () => {
            try{
                let now = new Date();
                let rosterYear = now.getFullYear();
                let rosterMonth = now.getMonth();
                let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
                let systemParam = await systemUtil.getSystemParam();
                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
                systemParam.noOfPrevDate = 0;
                let rosterDataUtil = new RosterDataUtil();
                await rosterDataUtil.init(itemList.calendarUtility.weekdayNames);
                await rosterDataUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay);
                updateItemList({
                    monthlyCalendar,
                    rosterDataUtil,
                    systemParam,
                    type: "init"
                });
            }catch (error){
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    let updateRosterMonth= async (newRosterMonth) => {
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        try {
            await itemList.rosterDataUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay);
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
        systemParam: itemList.systemParam,
        uiAction:{
            updateRosterMonth
        }
    }
}