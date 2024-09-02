import "../CalendarPicker.css";
import { Button } from "react-bootstrap";
import CalendarTable from "../CalendarTable";
import TimeSelector from "../timeSelector/TimeSelector";
import useDateTimePicker from "./useDateTimePicker";
export default function DateTimePicker({getSelectedValue, value }) {
    let dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const { isShowPicker, monthFullNameList, monthlyCalendar, result, tempValue, weekDayNameList, action } = useDateTimePicker(value);
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
            action.updateDateValue(value);
        }
    }
    let setTimeToNow=()=>{
        action.updateTempValue(new Date());
    }
    let submitValue=e=>{
        getSelectedValue(tempValue);
        action.closePicker();
    }
    
    return (
        <div className="dateTimePicker">
            <div
                className="dateTimeResult"
                onClick={action.togglePicker}>
                {dateFormatter.format(result)}
            </div>
            {isShowPicker &&
                <div className="pickerContainer">
                    <CalendarTable
                        bigPrev={action.prevYear}
                        bigNext={action.nextYear}
                        bodyRow={monthlyCalendar}
                        headerRow={headerRow}
                        getSelectedItem={getSelectedItem}
                        selectedItem={tempValue.getDate()}
                        smallPrev={action.prevMonth}
                        smallNext={action.nextMonth}
                        title={monthFullNameList[tempValue.getMonth()] + " " + tempValue.getFullYear()}
                    />                    
                    <div className="dateTimePickerTimeSelector">
                        <Button onClick={setTimeToNow}>Now</Button>
                        <TimeSelector 
                            getSelectedTime={action.updateTempValue}
                            value={tempValue}/>
                    </div>
                    <div className="todayRow">
                        <Button onClick={action.selectToday}>Today</Button>
                        <Button onClick={action.closePicker}>Cancel</Button>
                        <Button onClick={submitValue}>Ok</Button>
                    </div>
                </div>
            }
        </div>
    )
}