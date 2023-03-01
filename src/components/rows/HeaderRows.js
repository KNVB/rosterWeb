import CaptionRow from "./CaptionRow";
import DateRow from './DateRow';
import DayRow from './DayRow';
import HolidayRow from './HolidayRow';
import MonthPicker from '../util/monthPicker/MonthPicker';
import React from 'react';
import CaptionCell from "../cells/CaptionCell";
export default function HeaderRows({
  calendarUtility,
  caption,
  highLightCellIndex,
  monthlyCalendar,
  systemParam,  
  updateRosterMonth,
}) {
  return (
    <thead>
      <CaptionRow caption={caption}/>
      <tr>        
        <CaptionCell colSpan="42">
          <MonthPicker minDate={systemParam.monthPickerMinDate} onChange={updateRosterMonth} />
        </CaptionCell>        
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
