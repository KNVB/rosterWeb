import CaptionRow from "./CaptionRow";
import NameCell from "../cells/NameCell";
import DateRow from './DateRow';
import DayRow from './DayRow';
import HolidayRow from './HolidayRow';
import MonthPicker from '../util/monthPicker/MonthPicker';
import React from 'react';
import CaptionCell from "../cells/CaptionCell";
export default function HeaderRows({
  calendarUtility,
  highLightCellIndex,
  monthlyCalendar,
  systemParam,
  updateRosterMonth,
}) {
  return (
    <thead>
      <CaptionRow />
      <tr>
        <NameCell></NameCell>
        <CaptionCell colSpan="31">
          <MonthPicker minDate={systemParam.monthPickerMinDate} onChange={updateRosterMonth} />
        </CaptionCell>
        <th colSpan="10"></th>
      </tr>
      <HolidayRow calendarDateList={monthlyCalendar.calendarDateList} noOfPrevDate={systemParam.noOfPrevDate}/>
      <DayRow
        calendarDateList={monthlyCalendar.calendarDateList}
        calendarUtility={calendarUtility}
        noOfPrevDate={systemParam.noOfPrevDate}
      />
      <DateRow 
        calendarDateList={monthlyCalendar.calendarDateList} 
        highLightCellIndex={(highLightCellIndex - systemParam.noOfPrevDate - 1)}
        noOfPrevDate={systemParam.noOfPrevDate}/>
    </thead>
  );
}
