import DayCell from "../cells/DayCell";
import NameCell from "../cells/NameCell";
import StatCell from "../cells/StatCell";
export default function DayRow({ calendarDateList, calendarUtility,noOfPrevDate }) {
  let dayCells = [];
  calendarDateList.forEach((calendarDate, index) => {
    dayCells.push(
      <DayCell calendarDate={calendarDate} calendarUtility={calendarUtility} key={'day_' + index}/>
    );
  });

  for (let i = calendarDateList.length; i < 31; i++) {
    dayCells.push(
      <DayCell key={'day_' + i}></DayCell>
    );
  }
  let prevDayList = [];
  for (let i = 0; i < noOfPrevDate; i++) {
    prevDayList.push(<DayCell key={"prevDay_" + i} />);
  }
  console.log('DayRow is rendered.');
  return (
    <tr>
      <NameCell border>Days</NameCell>
      {prevDayList}
      {dayCells}
      <StatCell rowSpan="2">
        Total
        <br />
        Hour
      </StatCell>
      <StatCell rowSpan="2">
        Actual
        <br />
        Hour
      </StatCell>
      <StatCell colSpan="8">
        Hour Off Due
      </StatCell>
    </tr>
  );
}
