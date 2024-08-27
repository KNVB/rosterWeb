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
    const { isShowPicker, monthFullNameList, monthlyCalendar, result, weekDayNameList, action } = useDateTimePicker(value);
    let calendarRows = [];
    if (monthlyCalendar !== null) {
        monthlyCalendar.forEach((row,rowIndex) => {
            let calendarRow = [];
            row.forEach((d,columIndex) => {
                let className=[];

                if (d === result.getDate()) {
                    className.push("selectedDate");
                } else {
                    if (d !== ""){
                        className.push("clickable"); 
                    }
                }
                calendarRow.push(<td key={rowIndex+"_"+columIndex} className={className.join(" ")} onClick={()=>action.setSelectedDate(d)}>{d}</td>)
            });
            calendarRows.push(<tr key={"dateTime_"+rowIndex}>{calendarRow}</tr>);
        });
    }
    return (
        <div className="dateTimePicker">
            <div className="dateTimeResult" onClick={action.showPicker}>{dateFormatter.format(result)}</div>
            {isShowPicker &&
                <div className="pickerContainer">
                    <table className="calendarTable">
                        <thead>
                            <tr>
                                <td className="clickable text-start" onClick={action.prevYear}>&lt;&lt;</td>
                                <td className="clickable text-start" onClick={action.prevMonth}>&lt;</td>
                                <td colSpan={3}>
                                    {monthFullNameList[result.getMonth()]}&nbsp;
                                    {result.getFullYear()}
                                </td>
                                <td className="clickable text-end" onClick={action.nextMonth}>&gt;</td>
                                <td className="clickable text-end" onClick={action.nextYear}>&gt;&gt;</td>
                            </tr>
                            <tr className="dayRow">
                                {
                                    weekDayNameList.map(weekDayName => (
                                        <td key={weekDayName}>{weekDayName}</td>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {calendarRows}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}