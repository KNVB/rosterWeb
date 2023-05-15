import { useEffect, useReducer } from "react";
import CalendarUtility from "../../util/calendar/CalendarUtility";
import RosterDataUtil from "../../util/RosterDataUtil";
import RosterTableUtil from "../../util/RosterTableUtil";
import SystemUtil from "../../util/SystemUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.rosterDataUtil = action.rosterDataUtil;
            result.systemParam = action.systemParam;
            result.isLoading = false;
            break;
        case "refresh":
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
export function useRosterViewer() {
    const [itemList, updateItemList] = useReducer(reducer, {
        calendarDateList: null,
        calendarUtility: new CalendarUtility(),
        error: null,
        isLoading: true,
        noOfWorkingDay: -1,
        rosterDataUtil: new RosterDataUtil(),
        rosterTableUtil: new RosterTableUtil(),
        systemParam: null,
    });
    useEffect(() => {
        let systemUtil = new SystemUtil();
        let init = async () => {
            try {
                let now = new Date();
                let rosterYear = now.getFullYear();
                let rosterMonth = now.getMonth();
                let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
                let systemParam = await systemUtil.getSystemParam();
                systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
                systemParam.noOfPrevDate = 0;
                let rosterDataUtil = new RosterDataUtil();
                await rosterDataUtil.init(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay, itemList.calendarUtility.weekdayNames);
                updateItemList({
                    monthlyCalendar,
                    rosterDataUtil,
                    systemParam,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        init();
    }, []);
    //==============================================================================================================================    
    let isHighLightCell = cellIndex => {
        return itemList.rosterTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterTableUtil.isHighLightRow(rowIndex);
    }
    let getShiftCssClassName = shiftType => {
        return itemList.rosterDataUtil.getShiftCssClassName(shiftType);
    }
    let updateRosterMonth = async (newRosterMonth) => {
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
    let updateUI = (cellIndex, rowIndex) => {
        itemList.rosterTableUtil.updateUI(cellIndex, rowIndex);
        updateItemList({ type: "refresh" });
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        roster: itemList.rosterDataUtil.getRoster(),
        rosterMonth: {
            calendarDateList: itemList.calendarDateList,
            noOfWorkingDay: itemList.noOfWorkingDay
        },
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