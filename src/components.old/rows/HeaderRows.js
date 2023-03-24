import CaptionRow from "./CaptionRow";
import DateRow from './DateRow';
import DayRow from './DayRow';
import HolidayRow from './HolidayRow';
import MonthPicker from '../util/monthPicker/MonthPicker';
import CaptionCell from "../cells/CaptionCell";
export default function HeaderRows({
  caption,
  rosterDataAction,
  rosterDataList,
  uiAction
}) {
  return (
    <thead>
      <CaptionRow caption={caption} />
      <tr>
        <CaptionCell colSpan="42">
          <MonthPicker minDate={rosterDataList.systemParam.monthPickerMinDate} onChange={rosterDataAction.updateRosterMonth} />
        </CaptionCell>
      </tr>
      <HolidayRow calendarDateList={rosterDataList.monthlyCalendar.calendarDateList} noOfPrevDate={rosterDataList.systemParam.noOfPrevDate} />
      <DayRow
        calendarDateList={rosterDataList.monthlyCalendar.calendarDateList}
        calendarUtility={rosterDataList.calendarUtility}
        noOfPrevDate={rosterDataList.systemParam.noOfPrevDate}
      />
      <DateRow
        calendarDateList={rosterDataList.monthlyCalendar.calendarDateList}
        highLightCellIndex={uiAction.getHighLightCellIndex() - rosterDataList.systemParam.noOfPrevDate - 1}
        noOfPrevDate={rosterDataList.systemParam.noOfPrevDate} />
    </thead>
  );
}
