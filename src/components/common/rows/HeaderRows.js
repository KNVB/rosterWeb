import CaptionCell from "../cells/CaptionCell";
import MonthPicker from "../calendarPicker/monthPicker/MonthPicker";
export default function HeaderRows({ caption, calendarDateList, dataAction, hightLightAction, rosterMonth, systemParam }) {
    return (
        <thead>
            <tr>
                <CaptionCell colSpan="42">
                    {caption}
                </CaptionCell>
            </tr>
            <tr>
                <CaptionCell colSpan="42">
                    <MonthPicker minDate={systemParam.monthPickerMinDate} onChange={dataAction.updateRosterMonth} value={rosterMonth}/>
                </CaptionCell>
            </tr>
        </thead>
    );
}