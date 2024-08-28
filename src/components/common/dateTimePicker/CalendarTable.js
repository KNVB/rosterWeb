export default function CalendarTable({
    monthFullNameList,
    monthlyCalendar,
    nextMonth,
    nextYear,
    prevMonth,
    prevYear,
    selectedDate,
    selectToday,
    setSelectedDate,
    weekDayNameList }) {
    let calendarRows = [];
    if (monthlyCalendar !== null) {
        monthlyCalendar.forEach((row, rowIndex) => {
            let calendarRow = [];
            row.forEach((d, columIndex) => {
                let className = [];

                if (d === selectedDate.getDate()) {
                    className.push("selectedDate");
                } else {
                    if (d !== "") {
                        className.push("clickable");
                    }
                }
                calendarRow.push(<td key={rowIndex + "_" + columIndex} className={className.join(" ")} onClick={() => setSelectedDate(d)}>{d}</td>)
            });
            calendarRows.push(<tr key={"dateTime_" + rowIndex}>{calendarRow}</tr>);
        });
    }
    
    return (
        <table className="calendarTable">
            <thead>
                <tr>
                    <td className="clickable text-start" onClick={prevYear}>&lt;&lt;</td>
                    <td className="clickable text-start" onClick={prevMonth}>&lt;</td>
                    <td colSpan={3}>
                        {monthFullNameList[selectedDate.getMonth()]}&nbsp;
                        {selectedDate.getFullYear()}
                    </td>
                    <td className="clickable text-end" onClick={nextMonth}>&gt;</td>
                    <td className="clickable text-end" onClick={nextYear}>&gt;&gt;</td>
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
            <tfoot>
                <tr>
                    <td colSpan={7} className="text-end">
                        <span className="clickable" onClick={selectToday}>Today</span>
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}