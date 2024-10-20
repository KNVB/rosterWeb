import CaptionCell from "../cells/CaptionCell";
import DateRow from "./DateRow";
import DayRow from "./DayRow";
import MonthPicker from "../calendarPicker/monthPicker/MonthPicker";
import HolidayRow from "./HolidayRow";
export default function HeaderRows({ caption,calendarDateList , systemParam, uiAction }) {    
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
            <HolidayRow calendarDateList={calendarDateList} noOfPrevDate={systemParam.noOfPrevDate} />
            <DayRow calendarDateList={calendarDateList} noOfPrevDate={systemParam.noOfPrevDate}/>
            <DateRow calendarDateList={calendarDateList} uiAction={uiAction} noOfPrevDate={systemParam.noOfPrevDate} />
        </thead>
    )
}