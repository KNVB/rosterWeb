import "../CalendarPicker.css";
import "./MonthPicker.css";
import useMonthPicker from "./useMonthPicker";
import CalendarTable from "../calendarTable/CalendarTable";
export default function MonthPicker({ defaultValue, maxDate, minDate, onChange }) {
    let monthFormatter = new Intl.DateTimeFormat('en-ZA', {
        month: "long",
        year: "numeric"
    });
    const { 
        bodyRow,
        hasNextMonth, hasNextYear,
        hasPrevMonth, hasPrevYear,
        isShowPicker, result,
        tempResult, action } = useMonthPicker(defaultValue, maxDate, minDate);
    let getSelectedItem = value => {
        let temp = new Date(tempResult.getFullYear(), value, 1);
        action.updateValue(temp);
        onChange(temp);
    }
    let nextMonth = () => {
        let temp = new Date(result.getTime());
        temp.setMonth(temp.getMonth() + 1);
        action.updateValue(temp);
        onChange(temp);
    }
    let prevMonth = () => {
        let temp = new Date(result.getTime());
        temp.setMonth(temp.getMonth() - 1);
        action.updateValue(temp);
        onChange(temp);
    }

    return (
        <div className="monthPicker">
            <div
                className="monthPickResult">
                {
                    hasPrevMonth &&
                    <span onClick={prevMonth}>&lt;</span>
                }
                <span onClick={action.togglePicker}>{monthFormatter.format(result)}</span>
                &nbsp;
                {
                    hasNextMonth &&
                    <span onClick={nextMonth}>&gt;</span>
                }
            </div>
            {isShowPicker &&
                <div className="pickerContainer p-1">
                    <CalendarTable
                        bodyRow={bodyRow}
                        getSelectedItem={getSelectedItem}
                        hasSmallPrev={hasPrevYear}
                        hasSmallNext={hasNextYear}
                        smallPrev={action.prevYear}
                        smallNext={action.nextYear}
                        title={tempResult.getFullYear()}
                    />
                </div>
            }
        </div>
    );


}