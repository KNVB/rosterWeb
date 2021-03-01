import {useContext,useState} from 'react';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterNameCell from "../../cells/rosterNameCell/RosterNameCell";
import Parser from "html-react-parser";
import ShiftCell from "../../cells/shiftCell/ShiftCell";
import ShiftCountCell from "../../cells/shiftCountCell/ShiftCountCell";
import RosterWebContext from '../../../../RosterWebContext';
import Utility from '../../../../utils/Utility';
export default function RosterRow(props){
    const [isHighLightRow, setIsHighLightRow] = useState(false);
    
    let {activeShiftInfoList,monthlyCalendar,rosterData,setHightLightCellIndex} = useContext(RosterWebContext);
    let i;
    let roster=rosterData[props.itoId];
    let rosterRowData=Utility.calculateITOMonthlyStat(monthlyCalendar.noOfWorkingDay,roster,activeShiftInfoList);
    let rosterCellList=[];
    //console.log(roster);
    //console.log(rosterRowData);
    //console.log(monthlyCalendar.noOfWorkingDay);
    let itoNameContact = Parser(roster.itoName+ "<br>" + roster.itoPostName + " Extn. 2458");

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
        rosterCellList.push(<ShiftCell  key={"pre-"+i}/>);
    }

    for(i=0;i<monthlyCalendar.calendarDateList.length;i++){
        rosterCellList.push(
            <ShiftCell 
                key={props.itoId+"_shift_"+i}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}>
                {rosterRowData.shiftList[i]}
            </ShiftCell>
        );
    }
    
    for (let j=i;j<31;j++){
        rosterCellList.push(<BorderedAlignCenterCell key={props.itoId+"_shift_"+j}>{rosterRowData.shiftList[j]}</BorderedAlignCenterCell>);
    }

    return(
        <tr>
            
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