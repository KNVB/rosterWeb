export default function DayCell({ calendarDate, calendarUtility }) {
    let isPH = false;
    let textContent = '';
    if (calendarDate) {
        if (
            calendarDate.publicHoliday ||
            calendarDate.dayOfWeek === 0 ||
            calendarDate.dayOfWeek === 6
        ) {
            isPH = true;
        }
        textContent = calendarUtility.weekdayNames[calendarDate.dayOfWeek]
    }
    return (
        <td className={"borderCell dayCell text-center" + (isPH ? " phCell" : "")}>
            {textContent}
        </td>
    )
}