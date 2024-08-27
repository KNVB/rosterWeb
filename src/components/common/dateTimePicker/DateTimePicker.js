import "./DateTimePicker.css";
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
    const { isShowPicker, result } = useDateTimePicker(value);
    return (
        <div className="dateTimePicker">
            <div className="dateTimeResult">{dateFormatter.format(result)}</div>
            {isShowPicker &&
                <div className="pickerContainer">
                    <table className="pickerTable">
                        <thead>
                            <tr>
                                <td>&lt;&lt;</td>
                                <td>&lt;</td>
                                <td></td>
                                <td>&gt;</td>
                                <td>&gt;&gt;</td>
                            </tr>
                        </thead>
                    </table>
                </div>
            }
        </div>
    )
}