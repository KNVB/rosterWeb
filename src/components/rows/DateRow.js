import DateCell from "../cells/DateCell";
import NameCell from "../cells/NameCell";
import StatCell from "../cells/StatCell";
export default function DateRow({ calendarDateList, highLightCellIndex,noOfPrevDate }) {
  let dateCells = [];
  calendarDateList.forEach((calendarDate, index) => {
    dateCells.push(
      <DateCell calendarDate={calendarDate} highLightCellIndex={highLightCellIndex} index={index} key={'date_' + index}/>
    );
  });
  for (let i = calendarDateList.length; i < 31; i++) {
    dateCells.push(
      <DateCell key={'date_' + i}></DateCell>
    );
  }
  let prevDateList = [];
  for (let i = 0; i < noOfPrevDate; i++) {
    prevDateList.push(<DateCell key={"prevDate_" + i} />);
  }
  console.log('DateRow is rendered.');
  return (
    <tr>
      <NameCell border>
        Resident Support
        <br />
        Team Members
      </NameCell>
      {prevDateList}
      {dateCells}
      <StatCell rowSpan="1">
        Last
        <br />
        Month
      </StatCell>
      <StatCell rowSpan="1">
        This
        <br />
        Month
      </StatCell>
      <StatCell rowSpan="1">
        Total
      </StatCell>
      <StatCell rowSpan="1">
        Total No. of
        <br />A Shift
      </StatCell>
      <StatCell rowSpan="1">
        Total No. of
        <br />B Shift
      </StatCell>
      <StatCell rowSpan="1">
        Total No. of
        <br />C Shift
      </StatCell>
      <StatCell rowSpan="1">
        Total No. of
        <br />D Shift
      </StatCell>
      <StatCell rowSpan="1">
        No. of <br />
        working
        <br />
        day
      </StatCell>
    </tr>
  );
}
