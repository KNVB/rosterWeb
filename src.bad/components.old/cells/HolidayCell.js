export default function HolidayCell({ calendarDate }) {
    let isPH = false;
    if (calendarDate) {
        isPH = (calendarDate.publicHoliday && calendarDate.dayOfWeek !== 0);
    }
    return (
        <td className={"borderCell holidayCell text-center" + (isPH ? " phCell" : "")} title={(isPH ? calendarDate.festivalInfo : '')}>
            {isPH ? 'PH' : ''}
        </td>
    )
}