import EditableRosterRow from './EditableRosterRow';
import PreferredShiftRow from './PreferredShiftRow';
import VacantShiftRow from "./VacantShiftRow";
export default function RosterSchedulerBody({
    activeShiftList,
    monthlyCalendar,
    rosterList,
    systemParam,
    updateHighLightCellIndex
}) {
    let rowList = [];
    let itoIdList = Object.keys(rosterList);    
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
            />);
        rowList.push(
            <PreferredShiftRow 
                calendarDateList={monthlyCalendar.calendarDateList}
                key={"preferredShiftRow_" + itoIdList[i]}                
                rosterInfo={rosterInfo}
                systemParam={systemParam}
                updateHighLightCellIndex={updateHighLightCellIndex}
            />    
        );    
    });
    rowList.push(
        <VacantShiftRow
            calendarDateList={monthlyCalendar.calendarDateList}
            rosterList={rosterList}
            systemParam={systemParam}
            key="vacantRow"
        />
    );
    console.log('RosterSchedulerBody is rendered.');
    return <tbody>{rowList}</tbody>;
}