import EditableRosterRow from './EditableRosterRow';
import PreferredShiftRow from './PreferredShiftRow';
import VacantShiftRow from "./VacantShiftRow";
export default function RosterSchedulerBody({
    allITOStat,
    activeShiftList,
    monthlyCalendar,
    rosterList,
    systemParam,
    updatePreferredShift,
    updateHighLightCellIndex,
    updateShift
}) {
    let rowList = [];
    let itoIdList = Object.keys(rosterList);
    //console.log(allITOStat);
    itoIdList.forEach((itoId, i) => {
        let rosterInfo = rosterList[itoId];       
        //console.log(rosterInfo);
        rowList.push(
            <EditableRosterRow
                activeShiftList={activeShiftList}
                calendarDateList={monthlyCalendar.calendarDateList}
                itoId={itoIdList[i]}
                key={"rosterRow_" + itoIdList[i]}
                rosterInfo={rosterInfo}
                systemParam={systemParam}
                updateHighLightCellIndex={updateHighLightCellIndex}
                updateShift={updateShift} 
            />);
        rowList.push(
            <PreferredShiftRow 
                calendarDateList={monthlyCalendar.calendarDateList}
                itoId={itoIdList[i]}
                key={"preferredShiftRow_" + itoIdList[i]}                
                rosterInfo={rosterInfo}
                systemParam={systemParam}
                updateHighLightCellIndex={updateHighLightCellIndex}
                updatePreferredShift={updatePreferredShift}
            />    
        );    
    });
    rowList.push(
        <VacantShiftRow
            allITOStat={allITOStat}
            calendarDateList={monthlyCalendar.calendarDateList}
            rosterList={rosterList}
            systemParam={systemParam}
            key="vacantRow"
        />
    );
    //console.log('RosterSchedulerBody is rendered.');
    return <tbody>{rowList}</tbody>;
}