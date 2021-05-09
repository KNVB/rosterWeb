import {useContext,useState} from 'react';
import BorderedAlignCenterCell from './cell/BorderedAlignCenterCell';
import EditableShiftCell from './cell/EditableShiftCell';
import NameCell from './cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../utils/RosterWebContext';
import useShift from './useShift';
export default function VVRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],nameCellCssClass="",shift;
    let {activeShiftInfoList,monthlyCalendar,undoableRosterList,selectedRegionUtil}=useContext(RosterWebContext);
    let itoRoster=undoableRosterList.presentValue[props.itoId];
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    let {getITOStat}=useShift();
    let itoStat=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,itoRoster);
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
        shift=itoRoster.shiftList[i+1];
        let className=selectedRegionUtil.getBorderClass(i+1,props.rowIndex);
        cellList.push(
            <EditableShiftCell
                availableShiftList={itoRoster.availableShiftList}
                className={className}
                itoId={props.itoId}
                key={props.itoId+"_shift_"+i}
                setIsHighLightRow={setIsHighLightRow}
                rowIndex={props.rowIndex}>
                    {shift}
            </EditableShiftCell>
        )
    }
    for (let i=monthlyCalendar.calendarDateList.length;i<31;i++){
        cellList.push(
            <BorderedAlignCenterCell key={props.itoId+"_shift_"+i}></BorderedAlignCenterCell>
        );    
    }
    return(
        <tr id={props.itoId}>
            <NameCell className={nameCellCssClass}>{itoNameContact}</NameCell>
            {cellList}
            <BorderedAlignCenterCell>{itoStat.expectedWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.actualWorkingHour.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.lastMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.thisMonthBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.totalBalance.toFixed(2)}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.aShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.bxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.cShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell>{itoStat.shiftCountList.dxShiftCount}</BorderedAlignCenterCell>
            <BorderedAlignCenterCell className="tailCell">{itoStat.actualWorkingDayCount}</BorderedAlignCenterCell>
        </tr>
    )
}