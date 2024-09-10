import "../CalendarPicker.css";
import "./MonthPicker.css";
import useMonthPicker from "./useMonthPicker";
import CalendarTable from "../calendarTable/CalendarTable";
export default function MonthPicker({ defaultValue, maxDate, minDate, onChange }) {
    let monthFormatter = new Intl.DateTimeFormat('en-ZA', {
        month:"short",
        year: "numeric"
    });
    const { bodyRow,isShowPicker, hasNextYear, hasPrevYear, result, action } = useMonthPicker(defaultValue, maxDate, minDate);

    return (
        <div className="monthPicker">
            <div
                className="monthPickResult">
                {hasPrevYear &&
                    <>
                        <span>&lt;</span>
                        &nbsp;
                    </>
                }
                <span onClick={action.togglePicker}>{monthFormatter.format(result)}</span>
                {hasNextYear &&
                    <>
                        &nbsp;
                        <span>&gt;</span>
                    </>
                }
            </div>
            {isShowPicker &&
                <div className="pickerContainer p-1">
                      <CalendarTable
                        bodyRow={bodyRow}
                        smallPrev={action.prevYear}
                        smallNext={action.nextYear}
                        title={result.getFullYear()}
                        />
                </div>
            }
        </div>
    )
}