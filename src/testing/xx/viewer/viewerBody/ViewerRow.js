import {useContext,useState} from 'react';
import BorderedCell from '../../cell/BorderedCell';
import BorderedAlignCenterCell from '../../cell/BorderedAlignCenterCell';
import NameCell from '../../cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../utils/RosterWebContext';
import ShiftCell from '../../cell/ShiftCell';
export default function ViewerRow(props){
    let [contextValue]=useContext(RosterWebContext);
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],nameCellCssClass="";
    let itoRoster=contextValue.itoRosterList[props.itoId];
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    for (let i=0;i<contextValue.monthlyCalendar.calendarDateList.length;i++){
        cellList.push(
            <ShiftCell 
                availableShiftList={itoRoster.availableShiftList}
                itoId={props.itoId}
                key={props.itoId+"_shift_"+i}
                rowIndex={props.rowIndex}
                setIsHighLightRow={setIsHighLightRow}>
                {itoRoster.shiftList[i+1]}
            </ShiftCell>
        )
    }
    for (let i=contextValue.monthlyCalendar.calendarDateList.length;i<31;i++){
        cellList.push(
            <BorderedCell key={props.itoId+"_shift_"+i}></BorderedCell>
        );
    }
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    return (
        <tr id={props.itoId+':shift'}>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
            {cellList}
            <BorderedAlignCenterCell>{itoRoster.expectedWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.actualWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.lastMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.thisMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.totalBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.shiftCountList.aShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.shiftCountList.bxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.shiftCountList.cShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoRoster.shiftCountList.dxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell className="tailCell">{itoRoster.actualWorkingDayCount}</BorderedAlignCenterCell>       
        </tr>
    )
}