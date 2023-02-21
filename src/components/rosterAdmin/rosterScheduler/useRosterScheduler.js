import { useEffect, useReducer } from 'react';
import CalendarUtility from '../../../util/calendar/CalendarUtility.js';
import RosterUtil from '../../../util/RosterUtil.js';
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            console.log(action.data.systemParam);
            result.isLoading = false;
            result.monthlyCalendar = result.calendarUtility.getMonthlyCalendar(result.rosterMonth.getFullYear(), result.rosterMonth.getMonth());
            result.rosterList = action.data.rosterList;
            result.systemParam = {
                maxConsecutiveWorkingDay: action.data.maxConsecutiveWorkingDay,
                monthPickerMinDate: new Date(action.data.systemParam.monthPickerMinDate.year, action.data.systemParam.monthPickerMinDate.month - 1, action.data.systemParam.monthPickerMinDate.date),
                noOfPrevDate: action.data.systemParam.noOfPrevDate
            }
            result.activeShiftList = action.data.activeShiftList;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "updateHighLightCellIndex":
            result.highLightCellIndex = action.value;
            break;
        case 'updateRosterMonth':
            let monthlyCalendar = result.calendarUtility.getMonthlyCalendar(
                action.newRosterMonth.getFullYear(),
                action.newRosterMonth.getMonth()
            );
            result.activeShiftList = action.data.activeShiftList;
            result.rosterList = action.data.rosterList;
            result.monthlyCalendar = monthlyCalendar;
            result.rosterMonth = action.newRosterMonth;
            break
        default:
            break;
    }
    return result;
}
export function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        "calendarUtility": new CalendarUtility(),
        error: null,
        highLightCellIndex: -1,
        isLoading: true,
        rosterMonth: new Date()
    });
    let updateHighLightCellIndex = cellIndex => {
        updateItemList({ type: "updateHighLightCellIndex", value: cellIndex });
    }
    let updateRosterMonth = async (newRosterMonth) => {
        let rosterUtil = new RosterUtil();
        try {
            let data = await rosterUtil.getRosterViewerData(newRosterMonth.getFullYear(), newRosterMonth.getMonth() + 1);
            updateItemList({ "data": data, newRosterMonth: newRosterMonth, type: 'updateRosterMonth' });
        } catch (error) {
            updateItemList({ "error": error, "type": "setError" });
        }
    };
    useEffect(() => {
        let rosterUtil = new RosterUtil();
        let getData = async () => {
            try {
                let data = await rosterUtil.getRosterViewerData(itemList.rosterMonth.getFullYear(), itemList.rosterMonth.getMonth() + 1);
                updateItemList({ data: data, type: "init" });
            } catch (error) {
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, [])
    return [
        itemList,
        updateHighLightCellIndex,
        updateRosterMonth
    ]
}