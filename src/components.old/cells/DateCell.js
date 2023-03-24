export default function DateCell({ calendarDate, highLightCellIndex, index }) {
    let isHighLight = false;
    let isToday = false;
    let textContent = '';
    if (calendarDate) {
        if (index === highLightCellIndex) {
            isHighLight = true;
        }
        isToday = calendarDate.today;
        textContent = calendarDate.dateOfMonth;
    }
    return (
        <td className={"borderCell dateCell text-center" + (isHighLight ? " highlightCell" : "") + (isToday ? " todayCell" : "")}>
            {textContent}
        </td>
    )
}