import "../CalendarPicker.css";
import CalendarTable from "../CalendarTable";
import useDateTimePicker from "./useDateTimePicker";
export default function DateTimePicker({ value }) {
    let dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const { isShowPicker, monthFullNameList, monthlyCalendar, result, weekDayNameList, action } = useDateTimePicker(value);
    let headerRow = { columnList: [] };

    weekDayNameList.forEach((weekDayName, index) => {
        switch (index) {
            case 0:
            case 6:
                headerRow.columnList.push({ className: "ph", value: weekDayName });
                break;
            default:
                headerRow.columnList.push({ value: weekDayName });
                break;
        }
    });
    let getSelectedItem = value => {
        if (value !== "") {
            action.updateValue(value);
        }
    }

    return (
        <div className="dateTimePicker">
            <div className="dateTimeResult" onClick={action.togglePicker}>{dateFormatter.format(result)}</div>
            {isShowPicker &&
                <div className="pickerContainer">
                <CalendarTable
                    bigPrev={action.prevYear}
                    bigNext={action.nextYear}
                    bodyRow={monthlyCalendar}
                    headerRow={headerRow}
                    getSelectedItem={getSelectedItem}
                    selectedItem={result.getDate()}
                    smallPrev={action.prevMonth}
                    smallNext={action.nextMonth}
                    title={monthFullNameList[result.getMonth()] + " " + result.getFullYear()}
                />
                </div>
            }
        </div>
    )
}