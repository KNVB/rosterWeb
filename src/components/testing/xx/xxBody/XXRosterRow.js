import {useContext} from 'react';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import EditableShiftCell from '../cell/EditableShiftCell';
import NameCell from '../cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../../utils/RosterWebContext';
import ShiftCell from '../cell/ShiftCell';
import useShift from '../../../../utils/useShift';
export default function XXRosterRow(props){
    let cellList=[];
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let {getITOStat}=useShift();
    let itoRoster=contextValue.rosterList[props.itoId].presentValue;
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    let previousMonthShiftList=contextValue.previousMonthShiftList[props.itoId];
    let itoStat=getITOStat(contextValue.activeShiftInfoList,contextValue.monthlyCalendar.noOfWorkingDay,itoRoster);
    if (previousMonthShiftList){
        for(let i=contextValue.systemParam.maxConsecutiveWorkingDay-contextValue.systemParam.noOfPrevDate;i<previousMonthShiftList.length;i++){
            cellList.push(
                <ShiftCell availableShiftList={itoRoster.availableShiftList} key={"prev-"+i}>
                    {previousMonthShiftList[i]}
                </ShiftCell>
            );
        }
    }else {
        for (let i=0;i<contextValue.systemParam.noOfPrevDate;i++){
            cellList.push(<ShiftCell availableShiftList={itoRoster.availableShiftList} key={"prev-"+i}/>);
        }
    }
    for (let i=0;i<contextValue.monthlyCalendar.calendarDateList.length;i++){
        let className=contextValue.selectedRegionUtil.getBorderClass(i+contextValue.systemParam.noOfPrevDate+1,props.rowIndex);
        cellList.push(
            <EditableShiftCell
                availableShiftList={itoRoster.availableShiftList}
                className={className}
                itoId={props.itoId}
                key={props.itoId+"_shift_"+i}
                rowIndex={props.rowIndex}>
                    {itoRoster.shiftList[i+1]}
            </EditableShiftCell>
        )
    }
    for (let i=contextValue.monthlyCalendar.calendarDateList.length;i<31;i++){
        cellList.push(
            <BorderedAlignCenterCell key={props.itoId+"_shift_"+i}></BorderedAlignCenterCell>
        );
    }
    return(
        <tr id={props.itoId+':shift'}>
             <NameCell>{itoNameContact}</NameCell>
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