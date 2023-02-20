import { useEffect, useReducer } from 'react';
import CalendarUtility from '../../util/calendar/CalendarUtility.js';
import RosterUtil from '../../util/RosterUtil.js';
let reducer = (state, action) => {
  let result = { ...state };
  switch (action.type) {
    case "setError":
      result.error = action.error;
      break;
    default:
      break;
  }
  return result;
}
export function useRosterViewer() {
  const [itemList, updateItemList] = useReducer(reducer, {
    "calendarUtility": new CalendarUtility(),
    error: null,
    isLoading: true,
    rosterMonth: new Date()
  });
  let updateHighLightCellIndex = cellIndex => {
    updateItemList({ type: "updateHighLightCellIndex", value: cellIndex });
  }
  let updateRosterMonth = (newRosterMonth) => {
    let monthlyCalendar = itemList.calendarUtility.getMonthlyCalendar(
      newRosterMonth.getFullYear(),
      newRosterMonth.getMonth()
    );
    updateItemList({ type: 'update', monthlyCalendar: monthlyCalendar });
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