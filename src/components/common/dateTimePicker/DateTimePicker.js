import "./DateTimePicker.css";
import CalendarTable from "./CalendarTable";
import TimeSelector from "./TimeSelector";
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
    const { isShowPicker, monthFullNameList, monthlyCalendar, result,tempValue, weekDayNameList, action } = useDateTimePicker(value);
   
    return (
        <div className="dateTimePicker">
            <div className="dateTimeResult" onClick={action.showPicker}>{dateFormatter.format(result)}</div>
            {isShowPicker &&
                <div className="pickerContainer">
                   <CalendarTable 
                        monthFullNameList={monthFullNameList}
                        monthlyCalendar={monthlyCalendar}
                        nextMonth={action.nextMonth}
                        nextYear={action.nextYear}
                        prevMonth={action.prevMonth}
                        prevYear={action.prevYear}
                        selectedDate={tempValue}
                        selectToday={action.selectToday}
                        setSelectedDate={action.updateTempValue}
                        weekDayNameList={weekDayNameList}/>
                    Time: 
                    <TimeSelector
                        selectedTime={tempValue}
                    />    
                </div>
            }
        </div>
    )
}