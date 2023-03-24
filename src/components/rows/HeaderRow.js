import CaptionCell from "../cells/CaptionCell";
import DateRow from "../rows/DateRow";
import DayRow from "../rows/DayRow";
import MonthPicker from "../util/monthPicker/MonthPicker";
import HolidayRow from "../rows/HolidayRow";
export default function HeaderRow({ calendarDateList, calendarUtility, caption, uiAction, systemParam }) {
    return (
        <thead>
            <tr>
                <CaptionCell colSpan="42">
                    {caption}
                </CaptionCell>
            </tr>
            <tr>
                <CaptionCell colSpan="42">
                    <MonthPicker minDate={systemParam.monthPickerMinDate} />
                </CaptionCell>
            </tr>
            <HolidayRow calendarDateList={calendarDateList} noOfPrevDate={systemParam.noOfPrevDate} />
            <DayRow calendarDateList={calendarDateList} calendarUtility={calendarUtility} noOfPrevDate={systemParam.noOfPrevDate} />
            <DateRow calendarDateList={calendarDateList} uiAction={uiAction} noOfPrevDate={systemParam.noOfPrevDate} />
        </thead>
    )
}