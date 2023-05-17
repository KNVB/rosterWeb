import CaptionCell from "../cells/CaptionCell";
import DateRow from "./DateRow";
import DayRow from "./DayRow";
import MonthPicker from "../util/monthPicker/MonthPicker";
import HolidayRow from "./HolidayRow";
export default function HeaderRows({ caption, rosterMonth, systemParam, uiAction,weekdayNames }) {
    return (
        <thead>
            <tr>
                <CaptionCell colSpan="42">
                    {caption}
                </CaptionCell>
            </tr>
            <tr>
                <CaptionCell colSpan="42">
                    <MonthPicker minDate={systemParam.monthPickerMinDate} onChange={uiAction.updateRosterMonth}/>
                </CaptionCell>
            </tr>
            <HolidayRow calendarDateList={rosterMonth.calendarDateList} noOfPrevDate={systemParam.noOfPrevDate} />
            <DayRow calendarDateList={rosterMonth.calendarDateList} noOfPrevDate={systemParam.noOfPrevDate} weekdayNames={weekdayNames} />
            <DateRow calendarDateList={rosterMonth.calendarDateList} uiAction={uiAction} noOfPrevDate={systemParam.noOfPrevDate} />
        </thead>
    )
}