import HolidayCell from "../cells/HolidayCell";
import NameCell from "../cells/NameCell";
export default function HolidayRow({ calendarDateList, noOfPrevDate }) {
  let holidayCells = [];
  calendarDateList.forEach((calendarDate, index) => {
    holidayCells.push(
      <HolidayCell
        calendarDate={calendarDate}
        key={'holiday_' + index}>

      </HolidayCell>
    );
  });
  for (let i = calendarDateList.length; i < 31; i++) {
    holidayCells.push(
      <HolidayCell key={'holiday_' + i}></HolidayCell>
    );
  }
  console.log('HolidayRow is rendered.');
  let prevHolidayList = [];
  for (let i = 0; i < noOfPrevDate; i++) {
    prevHolidayList.push(<HolidayCell key={"prevHoliday_" + i} />);
  }
  return (
    <tr>
      <NameCell border>Holiday</NameCell>
      {prevHolidayList}
      {holidayCells}
      <td className="border" colSpan="10" key="holiday_31"></td>
    </tr>
  );
}
