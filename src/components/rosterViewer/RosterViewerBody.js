import RosterViewerRow from './RosterViewerRow';
export default function RosterViewerBody({
  activeShiftList,
  highLightRowIndex,
  monthlyCalendar,
  rosterList,
  updateHighLight
}) {
  let rowList = [];
  let itoIdList = Object.keys(rosterList);
  itoIdList.forEach((itoId, i) => {
    let rosterInfo = rosterList[itoId];
    rowList.push(
      <RosterViewerRow
        activeShiftList={activeShiftList}
        calendarDateList={monthlyCalendar.calendarDateList}
        itoId={itoIdList[i]}
        isHighLightRow={(highLightRowIndex === (i + 5))}
        key={"rosterRow_" + itoIdList[i]}
        rosterInfo={rosterInfo}
        updateHighLight={updateHighLight}
      />
    );
  })
  console.log('RosterViewerBody is rendered.');
  return <tbody>{rowList}</tbody>;
}
