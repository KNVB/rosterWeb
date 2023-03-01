import { useEffect, useReducer } from 'react';
import CalendarUtility from '../../util/calendar/CalendarUtility.js';
import RosterUtil from '../../util/RosterUtil.js';
import ShiftUtil from '../../util/ShiftUtil.js';
import SystemUtil from '../../util/SystemUtil.js';
let reducer = (state, action) => {
  let result = { ...state };
  switch (action.type) {
    case "init":
      result.activeShiftList = action.activeShiftList;
      result.isLoading = false;
      result.monthlyCalendar = action.monthlyCalendar;
      result.rosterList = action.rosterList;
      result.systemParam = action.systemParam;
      break;
    case "setError":
      result.error = action.error;
      break;
    case "updateHighLight":
      result.highLightCellIndex = action.cellIndex;
      result.highLightRowIndex=action.rowIndex;
      break;
    case 'updateRosterMonth':
      result.rosterList = action.rosterList;
      result.monthlyCalendar = action.monthlyCalendar;
      result.rosterMonth = action.newRosterMonth;
      break
    default:
      break;
  }
  return result;
}
export function useRosterViewer() {
  const [itemList, updateItemList] = useReducer(reducer, {
    activeShiftList: null,
    "calendarUtility": new CalendarUtility(),
    error: null,
    highLightCellIndex: -1,
    highLightRowIndex: -1,
    isLoading: true,
    monthlyCalendar: null,
    rosterList: null,
    rosterMonth: new Date(),
    systemParam: null,
  });

  let updateHighLight = (cellIndex, rowIndex) => {
    updateItemList({ type: "updateHighLight", cellIndex: cellIndex, rowIndex: rowIndex });
  }
  let updateRosterMonth = async (newRosterMonth) => {
    let rosterUtil = new RosterUtil();
    try {
      let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(newRosterMonth.getFullYear(), newRosterMonth.getMonth());
      let rosterList = await rosterUtil.getRosterListForViewer(itemList.activeShiftList, monthlyCalendar.noOfWorkingDay, newRosterMonth.getFullYear(), newRosterMonth.getMonth() + 1);
      updateItemList({
        monthlyCalendar,
        newRosterMonth,
        rosterList,
        type: 'updateRosterMonth'
      });
    } catch (error) {
      updateItemList({ "error": error, "type": "setError" });
    }
  };
  useEffect(() => {
    let rosterUtil = new RosterUtil();
    let shiftUtil = new ShiftUtil();
    let systemUtil = new SystemUtil();
    let getData = async () => {
      try {
        let activeShiftList = await shiftUtil.getActiveShiftList();
        let systemParam = await systemUtil.getSystemParam();
        systemParam["noOfPrevDate"] = 0;
        systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(itemList.rosterMonth.getFullYear(), itemList.rosterMonth.getMonth());
        let rosterList = await rosterUtil.getRosterListForViewer(activeShiftList, monthlyCalendar.noOfWorkingDay, itemList.rosterMonth.getFullYear(), itemList.rosterMonth.getMonth() + 1);

        updateItemList({
          activeShiftList,
          monthlyCalendar,
          rosterList,
          systemParam,
          type: "init"
        });
      } catch (error) {
        console.log(error);
        updateItemList({ "error": error, "type": "setError" });
      }
    }
    getData();
  }, [])
  return [
    itemList,
    updateHighLight,
    updateRosterMonth
  ]
}