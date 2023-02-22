import { useEffect, useReducer } from 'react';
import CalendarUtility from '../../util/calendar/CalendarUtility.js';
import ITOShiftStatUtil from '../../util/ITOShiftStatUtil';
import RosterUtil from '../../util/RosterUtil.js';
import ShiftUtil from '../../util/ShiftUtil.js';
import SystemUtil from '../../util/SystemUtil.js';
let reducer = (state, action) => {
  let result = { ...state };
  switch (action.type) {
    case "init":
      result.isLoading = false;
      result.monthlyCalendar = action.monthlyCalendar;
      result.rosterList = action.rosterList;
      result.systemParam = action.systemParam;
      result.activeShiftList = action.activeShiftList;
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
export function useRosterViewer() {
  const [itemList, updateItemList] = useReducer(reducer, {
    activeShiftList: null,
    "calendarUtility": new CalendarUtility(),
    error: null,
    highLightCellIndex: -1,
    isLoading: true,
    monthlyCalendar: null,
    rosterList: null,
    rosterMonth: new Date(),
    systemParam: null,
  });
  let genITOStat = (activeShiftList, monthlyCalendar, rosterList) => {
    let result = {};
    let { getITOStat } = ITOShiftStatUtil();
    let itoIdList = Object.keys(rosterList);
    itoIdList.forEach((itoId, i) => {
      let rosterInfo = getITOStat(activeShiftList, monthlyCalendar.noOfWorkingDay, rosterList[itoId]);
      result[itoId] = rosterInfo;
    })
    return result;
  }
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
    let shiftUtil = new ShiftUtil();
    let systemUtil = new SystemUtil();
    let getData = async () => {
      try {
        let activeShiftList = await shiftUtil.getActiveShiftList();
        let rosterList = await rosterUtil.getRosterList(itemList.rosterMonth.getFullYear(), itemList.rosterMonth.getMonth() + 1);
        let systemParam = await systemUtil.getSystemParam();
        systemParam["noOfPrevDate"] = 0;
        systemParam.monthPickerMinDate = new Date(systemParam.monthPickerMinDate.year, systemParam.monthPickerMinDate.month - 1, systemParam.monthPickerMinDate.date);
        let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(itemList.rosterMonth.getFullYear(), itemList.rosterMonth.getMonth());

        rosterList = genITOStat(activeShiftList, monthlyCalendar, rosterList);

        updateItemList({ activeShiftList: activeShiftList, monthlyCalendar: monthlyCalendar, rosterList: rosterList, systemParam: systemParam, type: "init" });
      } catch (error) {
        console.log(error);
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