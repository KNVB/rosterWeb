import EditableRosterRow from './EditableRosterRow';
import PreferredShiftRow from './PreferredShiftRow';
import VacantShiftRow from "./VacantShiftRow";
export default function RosterSchedulerBody({
    allITOStat,
    activeShiftList,
    getSelectedClassName,
    highLightRowIndex,
    monthlyCalendar,
    rosterList,
    startSelect,
    systemParam,
    updatePreferredShift,
    updateShift,
    updateUI
}) {
    let rowList = [];
    let itoIdList = Object.keys(rosterList);
    //console.log(allITOStat);
    itoIdList.forEach((itoId, i) => {
        if (i === 1) {
            let rosterInfo = rosterList[itoId];
            //console.log(rosterInfo);
            rowList.push(
                <EditableRosterRow
                    activeShiftList={activeShiftList}
                    allITOStat={allITOStat}
                    calendarDateList={monthlyCalendar.calendarDateList}
                    getSelectedClassName={getSelectedClassName}
                    itoId={itoIdList[i]}
                    isHighLightRow={(highLightRowIndex === (i * 2 + 5))}
                    key={"rosterRow_" + itoIdList[i]}
                    rosterInfo={rosterInfo}
                    startSelect={startSelect}
                    systemParam={systemParam}
                    updateUI={updateUI}
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
                    updateUI={updateUI}
                    updatePreferredShift={updatePreferredShift}
                />
            );
        }
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