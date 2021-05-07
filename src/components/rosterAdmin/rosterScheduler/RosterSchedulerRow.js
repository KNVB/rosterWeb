import {useContext,useState} from 'react';
import BorderedAlignCenterCell from '../../cell/BorderedAlignCenterCell';
import EditableShiftCell from './EditableShiftCell';
import NameCell from '../../cell/NameCell';
import Parser from "html-react-parser";
import RosterWebContext from '../../../utils/RosterWebContext';
import ShiftCell from '../../cell/ShiftCell';
import useShift from '../../../utils/useShift';
export default function RosterSchedulerRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    let cellList=[],nameCellCssClass="";
    let {activeShiftInfoList,monthlyCalendar,undoableRosterSchedulerList,selectedRegionUtil,systemParam}=useContext(RosterWebContext);
    let itoRoster=undoableRosterSchedulerList.presentValue.rosterList[props.itoId];
    let previousMonthRoster=undoableRosterSchedulerList.presentValue.previousMonthShiftList[props.itoId];
    let itoNameContact = Parser(itoRoster.itoName+ "<br>" + itoRoster.itoPostName + " Extn. 2458");
    let {getITOStat}=useShift();
    let itoStat=getITOStat(activeShiftInfoList,monthlyCalendar.noOfWorkingDay,itoRoster);
    if (isHighLightRow){
        nameCellCssClass="highlightCell";
    }
    //console.log(previousMonthRoster,props.itoId,systemParam.maxConsecutiveWorkingDay,systemParam.noOfPrevDate);
    if (previousMonthRoster){
        for(let i=systemParam.maxConsecutiveWorkingDay-systemParam.noOfPrevDate;i<previousMonthRoster.length;i++){
            cellList.push(
                <ShiftCell availableShiftList={itoRoster.availableShiftList} key={"prev-"+i}>
                    {previousMonthRoster[i]}
                </ShiftCell>
            );
        }
    }else {
        for (let i=0;i<systemParam.noOfPrevDate;i++){
            cellList.push(<ShiftCell availableShiftList={itoRoster.availableShiftList} key={"prev-"+i}/>);
        }
    }
    for (let i=0;i<monthlyCalendar.calendarDateList.length;i++){
        let className=selectedRegionUtil.getBorderClass(i+systemParam.noOfPrevDate+1,props.rowIndex);
        cellList.push(
            <EditableShiftCell
                availableShiftList={itoRoster.availableShiftList}
                className={className}
                itoId={props.itoId}
                key={props.itoId+"_shift_"+i}
                setIsHighLightRow={setIsHighLightRow}
                rowIndex={props.rowIndex}>
                    {itoRoster.shiftList[i+1]}
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