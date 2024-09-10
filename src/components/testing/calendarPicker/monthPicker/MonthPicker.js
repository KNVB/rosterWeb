import "../CalendarPicker.css";
import "./MonthPicker.css";
import useMonthPicker from "./useMonthPicker";
import CalendarTable from "../calendarTable/CalendarTable";
export default function MonthPicker({ defaultValue, maxDate, minDate, onChange }) {
    let monthFormatter = new Intl.DateTimeFormat('en-ZA', {
        month: "long",
        year: "numeric"
    });
    const { bodyRow, isShowPicker, hasNextYear, hasPrevYear, result, tempResult, action } = useMonthPicker(defaultValue, maxDate, minDate);
    let getSelectedItem = value => {
        let temp = new Date(tempResult.getFullYear(), value, 1);
        action.updateValue(temp);
        onChange(temp);
    }
    let nextYear = () => {
        let temp = new Date(result.getTime());
        temp.setFullYear(temp.getFullYear() + 1);
        action.updateValue(temp);
        onChange(temp);
    }
    let prevYear = () => {
        let temp = new Date(result.getTime());
        temp.setFullYear(temp.getFullYear() - 1);
        action.updateValue(temp);
        onChange(temp);
    }
    return (
        <div className="monthPicker">
            <div
                className="monthPickResult">
                <span onClick={prevYear}>&lt;</span>
                &nbsp;
                <span onClick={action.togglePicker}>{monthFormatter.format(result)}</span>
                &nbsp;
                <span onClick={nextYear}>&gt;</span>
            </div>
            {isShowPicker &&
                <div className="pickerContainer p-1">
                    <CalendarTable
                        bodyRow={bodyRow}
                        getSelectedItem={getSelectedItem}
                        smallPrev={action.prevYear}
                        smallNext={action.nextYear}
                        title={tempResult.getFullYear()}
                    />
                </div>
            }
        </div>
    );


}