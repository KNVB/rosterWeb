export default function HolidayCell({calendarDate}) {
    let isPH = false;
    if (calendarDate) {
        isPH = (calendarDate.publicHoliday && calendarDate.dayOfWeek !== 0);
    }
    return (
        <td className={"borderCell holidayCell" + (isPH ? " phCell" : "")} title={(isPH ? calendarDate.festivalInfo : '')}>
            {isPH ? 'PH' : ''}
        </td>
    );
}