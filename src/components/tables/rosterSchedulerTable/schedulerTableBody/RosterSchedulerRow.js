import {useContext,useState} from 'react';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import CursoredShiftCell from '../../cells/cursoredShiftCell/CursoredShiftCell';
import Parser from "html-react-parser";
import RosterNameCell from '../../cells/rosterNameCell/RosterNameCell';
import RosterWebContext from '../../../../RosterWebContext';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
import Utility from '../../../../utils/Utility';
export default function RosterSchedulerRow(props){
    let cellList=[],i;
    let {activeShiftInfoList,monthlyCalendar,rosterData,systemParam} = useContext(RosterWebContext);
    //console.log(rosterData);
    let roster=rosterData.rosterList[props.itoId];
    let previousMonthShift=rosterData.previousMonthShiftList[props.itoId];
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");
    let rosterRowData=Utility.calculateShiftStat(monthlyCalendar.noOfWorkingDay,roster,activeShiftInfoList);
    for (i=systemParam.maxConsecutiveWorkingDay-systemParam.noOfPrevDate;i<previousMonthShift.length;i++){
        cellList.push(<ShiftCell key={"prev-"+i}>{previousMonthShift[i]}</ShiftCell>);
    }
    for (i=0;i<31;i++){
        if (rosterRowData.shiftList[i]){
            cellList.push(<CursoredShiftCell itoId={props.itoId} rowType="rosterRow" key={props.itoId+"_shift_"+i}>{rosterRowData.shiftList[i]}</CursoredShiftCell>);
        }else {
            cellList.push(<BorderedAlignCenterCell key={props.itoId+"_shift_"+i}>{rosterRowData.shiftList[i]}</BorderedAlignCenterCell>);
        }
    }
    cellList.push(<BorderedAlignCenterCell key={props.itoId+"_totalHour"}>{rosterRowData.totalHour}</BorderedAlignCenterCell>);
    cellList.push(<BorderedAlignCenterCell key={props.itoId+"_actualHour"}>{rosterRowData.actualHour}</BorderedAlignCenterCell>);
    cellList.push(<BalanceCell key={props.itoId+"_lastMonthBalance"}>{rosterRowData.lastMonthBalance}</BalanceCell>);
    cellList.push(<BalanceCell key={props.itoId+"_thisMonthHourTotal"}>{rosterRowData.thisMonthHourTotal}</BalanceCell>);
    cellList.push(<BalanceCell key={props.itoId+"_thisMonthBalance"}>{rosterRowData.thisMonthBalance}</BalanceCell>);

    cellList.push(<ShiftCountCell key={props.itoId+"_aShiftCount"}>{rosterRowData.aShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_bxShiftCount"}>{rosterRowData.bxShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell  key={props.itoId+"_cShiftCount"}>{rosterRowData.cShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_dxShiftCount"}>{rosterRowData.dxShiftCount}</ShiftCountCell>);
    cellList.push(<ShiftCountCell key={props.itoId+"_noOfWorkingDay"} className="tailCell">{rosterRowData.noOfWorkingDay}</ShiftCountCell>);
    return(
        <tr>
            <RosterNameCell itoId={props.itoId}>{itoNameContact}</RosterNameCell>
            {cellList}
        </tr>
    )
}