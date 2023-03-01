import EditableRosterRow from './EditableRosterRow';
import PreferredShiftRow from './PreferredShiftRow';
import VacantShiftRow from "./VacantShiftRow";
export default function RosterSchedulerBody({
    allITOStat,
    activeShiftList,
    highLightRowIndex,
    monthlyCalendar,
    rosterList,
    systemParam,
    updateHighLight,
    updatePreferredShift,
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
                allITOStat={allITOStat}
                calendarDateList={monthlyCalendar.calendarDateList}
                itoId={itoIdList[i]}
                isHighLightRow={(highLightRowIndex === (i * 2 + 5))}
                key={"rosterRow_" + itoIdList[i]}
                rosterInfo={rosterInfo}
                systemParam={systemParam}
                updateHighLight={updateHighLight}
                updateShift={updateShift}
            />);
        rowList.push(
            <PreferredShiftRow
                calendarDateList={monthlyCalendar.calendarDateList}
                itoId={itoIdList[i]}
                isHighLightRow={(highLightRowIndex === (i * 2 + 6))}
                key={"preferredShiftRow_" + itoIdList[i]}
                rosterInfo={rosterInfo}
                systemParam={systemParam}
                updateHighLight={updateHighLight}
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