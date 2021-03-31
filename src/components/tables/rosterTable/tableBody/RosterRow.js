import {useContext,useState} from 'react';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import BorderedAlignCenterCell from '../../cells/BorderedAlignCenterCell';
import RosterNameCell from "../../cells/RosterNameCell";
import Parser from "html-react-parser";
import Roster from '../../../../utils/Roster';
import ShiftCell from "../../cells/shiftCell/ShiftCell";
import ShiftCountCell from "../../cells/shiftCountCell/ShiftCountCell";
import RosterWebContext from '../../../../utils/RosterWebContext';

export default function RosterRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    
    let {activeShiftInfoList,monthlyCalendar,rosterList,setHightLightCellIndex} = useContext(RosterWebContext);
    let i;
    let roster=rosterList[props.itoId];
    let rosterCellList=[];
    //console.log(roster);
    //console.log(rosterRowData);
    //console.log(monthlyCalendar.noOfWorkingDay);
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");
    Roster.calculateITOMonthlyStat(roster,monthlyCalendar.noOfWorkingDay,activeShiftInfoList)
    let deHightLight = e => {
        setHightLightCellIndex(-1);
        setIsHighLightRow(false);
    }
    let hightLight = e => {
        setHightLightCellIndex(e.target.cellIndex);
        setIsHighLightRow(true);
    }

    if (isHighLightRow){
        rosterCellList.push(<RosterNameCell className="highlightCell" key={props.itoId + "_nameCell"}>{itoNameContact}</RosterNameCell>);
    }else{
        rosterCellList.push(<RosterNameCell key={props.itoId + "_nameCell"}>{itoNameContact}</RosterNameCell>);
    }

    for (i=0;i<props.noOfPrevDate;i++){
        rosterCellList.push(<ShiftCell availableShiftList={roster.availableShiftList} key={"pre-"+i}/>);
    }

    for(i=0;i<monthlyCalendar.calendarDateList.length;i++){
        rosterCellList.push(
            <ShiftCell
                availableShiftList={roster.availableShiftList} 
                key={props.itoId+"_shift_"+i}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}>
                {roster.shiftList[i+1]}
            </ShiftCell>
        );
    }
    
    for (let j=i;j<31;j++){
        rosterCellList.push(<BorderedAlignCenterCell key={props.itoId+"_shift_"+j}></BorderedAlignCenterCell>);
    }

    return(
        <tr>
            
            {rosterCellList}
            <BorderedAlignCenterCell>
                {roster.totalHour.toFixed(2)}
            </BorderedAlignCenterCell>
            <BorderedAlignCenterCell>
                {roster.actualWorkingHour.toFixed(2)}
            </BorderedAlignCenterCell>
            <BalanceCell>
                {roster.lastMonthBalance.toFixed(2)}
            </BalanceCell>

            <BalanceCell>
                {roster.thisMonthHourTotal.toFixed(2)}
            </BalanceCell>

            <BalanceCell>
                {roster.thisMonthBalance.toFixed(2)}
            </BalanceCell>

            <ShiftCountCell>
                {roster.shiftCountList.aShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {roster.shiftCountList.bxShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {roster.shiftCountList.cShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {roster.shiftCountList.dxShiftCount}
            </ShiftCountCell>

            <ShiftCountCell className="tailCell">
                {roster.actualNoOfWorkingDay}
            </ShiftCountCell>

        </tr>
    )
}