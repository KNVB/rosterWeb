import {useContext} from 'react';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import CursoredShiftCell from '../../cells/cursoredShiftCell/CursoredShiftCell';
import RosterNameCell from "../../cells/rosterNameCell/RosterNameCell";
import Parser from "html-react-parser";
import ShiftCell from "../../cells/shiftCell/ShiftCell";
import ShiftCountCell from "../../cells/shiftCountCell/ShiftCountCell";
import RosterWebContext from '../../../../RosterWebContext';
import Utility from '../../../../utils/Utility';
export default function RosterRow(props){
    let {activeShiftInfoList,monthlyCalendar,rosterList} = useContext(RosterWebContext);
    let i;
    let roster=rosterList[props.itoId];
    let rosterRowData=Utility.calculateShiftStat(monthlyCalendar.noOfWorkingDay,roster,activeShiftInfoList);
    let rosterCellList=[];
    //console.log(rosterRowData);
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");

    for (i=0;i<props.noOfPrevDate;i++){
        rosterCellList.push(<ShiftCell key={"pre-"+i}/>);
    }
    
    for (i=0;i<31;i++){
        if (rosterRowData.shiftList[i]){
            rosterCellList.push(<CursoredShiftCell itoId={props.itoId} rowType="rosterRow" key={props.itoId+"_shift_"+i}>{rosterRowData.shiftList[i]}</CursoredShiftCell>);
        }else {
            rosterCellList.push(<BorderedAlignCenterCell key={props.itoId+"_shift_"+i}>{rosterRowData.shiftList[i]}</BorderedAlignCenterCell>);
        }
    }

    return(
        <tr>
            <RosterNameCell itoId={props.itoId}>{itoNameContact}</RosterNameCell>
            {rosterCellList}
            <BorderedAlignCenterCell>
                {rosterRowData.totalHour}
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell>
                {rosterRowData.actualHour}
            </BorderedAlignCenterCell>
            <BalanceCell>
                {rosterRowData.lastMonthBalance}
            </BalanceCell>

            <BalanceCell>
                {rosterRowData.thisMonthHourTotal}
            </BalanceCell>

            <BalanceCell>
                {rosterRowData.thisMonthBalance}
            </BalanceCell>

            <ShiftCountCell>
                {rosterRowData.aShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {rosterRowData.bxShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {rosterRowData.cShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {rosterRowData.dxShiftCount}
            </ShiftCountCell>

            <ShiftCountCell className="tailCell">
                {rosterRowData.noOfWorkingDay}
            </ShiftCountCell>

        </tr>
    )
}