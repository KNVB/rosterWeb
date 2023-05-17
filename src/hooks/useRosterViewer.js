import { useEffect, useReducer } from "react";
import CalendarUtility from "../util/calendar/CalendarUtility";
import RosterTableUtil from "../dataUtil/RosterTableUtil";
import RosterViewerUtil from "../dataUtil/RosterViewerUtil";
import SystemUtil from "../dataUtil/SystemUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.monthlyCalendar = action.monthlyCalendar;
            result.roster = action.rosterViewerUtil.getRoster();
            result.rosterViewerUtil = action.rosterViewerUtil;
            result.systemParam = action.systemParam;
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateRosterMonth":
            result.calendarDateList = action.monthlyCalendar.calendarDateList;
            result.noOfWorkingDay = action.monthlyCalendar.noOfWorkingDay;
            result.roster = result.rosterViewerUtil.getRoster();
            break;            
        default:
            break;
    }
    return result;
}
export function useRosterViewer() {
    const [itemList, updateItemList] = useReducer(reducer, {
        calendarDateList:null,
        calendarUtility: new CalendarUtility(),
        monthlyCalendar: null,
        error: null,
        isLoading: true,
        noOfWorkingDay: -1,
        roster: null,
        rosterViewerUtil: null,
        rosterTableUtil: new RosterTableUtil(),
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
                let rosterViewerUtil = new RosterViewerUtil();
                await rosterViewerUtil.init(itemList.calendarUtility.weekdayNames);
                await rosterViewerUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay);
                updateItemList({
                    monthlyCalendar,
                    rosterViewerUtil,
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
    let getShiftCssClassName = shiftType => {
        return itemList.rosterViewerUtil.getShiftCssClassName(shiftType);
    }
    let isHighLightCell = cellIndex => {
        return itemList.rosterTableUtil.isHighLightCell(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterTableUtil.isHighLightRow(rowIndex);
    }
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        try {
            await itemList.rosterViewerUtil.loadData(rosterYear, rosterMonth + 1, monthlyCalendar.noOfWorkingDay);
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
        roster: itemList.roster,
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