import ITOShiftStatUtil from '../../util/ITOShiftStatUtil';
import RosterViewerRow from './RosterViewerRow';
export default function RosterViewerBody({
  activeShiftList,
  monthlyCalendar,
  rosterList,
  updateHighLightCellIndex
}) {
  let rowList = [];
  let itoIdList = Object.keys(rosterList);
  let {getITOStat}=ITOShiftStatUtil();
  itoIdList.forEach((itoId,i)=>{
    let rosterInfo = rosterList[itoId];
    rosterInfo=getITOStat(activeShiftList,monthlyCalendar.noOfWorkingDay,rosterInfo);
    rowList.push(
      <RosterViewerRow
        activeShiftList={activeShiftList}
        calendarDateList={monthlyCalendar.calendarDateList}        
        itoId={itoIdList[i]}
        key={"rosterRow_" + itoIdList[i]}
        rosterInfo={rosterInfo}
        updateHighLightCellIndex={updateHighLightCellIndex}
      />
    );
  })
  console.log('RosterViewerBody is rendered.');
  return <tbody>{rowList}</tbody>;
}
