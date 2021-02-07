import parse from 'html-react-parser'
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import CursoredShiftCell from '../../cells/cursoredShiftCell/CursoredShiftCell';
import NameCell from '../../cells/nameCell/NameCell';
import RosterTableCell from '../..//cells/rosterTableCell/RosterTableCell';
import ShiftCell from '../../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
import { useState} from 'react';
function RosterRow(props) {
    const [hightLightRowIndex,setHightLightRowIndex]=useState(-1);
    let content=parse(props.itoRoster.itoName+"<br>"+props.itoRoster.itoPostName+" Extn. 2458");
    let j=0,shiftCellList=[];
    
    for (let i=props.noOfPrevDate;i>0;i--){
        shiftCellList.push(
            <ShiftCell
                key={props.itoId+"_shift-"+i}
                shiftInfoList={props.shiftInfoList}/>    
        )
    }
    props.itoRoster.shiftList.forEach(itoShift=>{
        shiftCellList.push(<CursoredShiftCell 
                                key={props.itoId+"_shift_"+j} 
                                setHightLightCellIndex={props.setHightLightCellIndex}
                                setHightLightRowIndex={setHightLightRowIndex}
                                shiftInfoList={props.shiftInfoList}>
                                {itoShift} 
                           </CursoredShiftCell>);
        j++;
    })
    for (var i=props.itoRoster.shiftList.length;i<31;i++){
        shiftCellList.push(<RosterTableCell key={props.itoId+"_shift_"+i} />);
    }
    return(
        <tr>
            <NameCell hightLightRowIndex={hightLightRowIndex}>
                {content}
            </NameCell>
            {shiftCellList}
            <RosterTableCell className="text-center">
                {props.itoRoster.totalHour}
            </RosterTableCell>
            <RosterTableCell className="text-center">
                {props.itoRoster.actualHour}
            </RosterTableCell>
            <BalanceCell>
                {props.itoRoster.lastMonthBalance}
            </BalanceCell>

            <BalanceCell>
                {props.itoRoster.thisMonthHourTotal}
            </BalanceCell>

            <BalanceCell>
                {props.itoRoster.thisMonthBalance}
            </BalanceCell>

            <ShiftCountCell>
                {props.itoRoster.aShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {props.itoRoster.bxShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {props.itoRoster.cShiftCount}
            </ShiftCountCell>

            <ShiftCountCell>
                {props.itoRoster.dxShiftCount}
            </ShiftCountCell>

            <ShiftCountCell className="tailCell">
                {props.itoRoster.noOfWorkingDay}
            </ShiftCountCell>

        </tr>
    );
  }
export default RosterRow;