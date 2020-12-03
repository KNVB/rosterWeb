import parse from 'html-react-parser'
import BalanceCell from '../cells/balanceCell/BalanceCell'
import NameCell from '../cells/nameCell/NameCell';
import RosterTableCell from '../cells/rosterTableCell/RosterTableCell';
import ShiftCell from '../cells/shiftCell/ShiftCell';
import ShiftCountCell from '../cells/shiftCountCell/ShiftCountCell';
function RosterRow(props) {
    var content=parse(props.itoRoster.itoName+"<br>"+props.itoRoster.itoPostName+" Extn. 2458");
    var j=0,shiftCellList=[];
    props.itoRoster.shiftList.forEach(itoShift=>{
        shiftCellList.push(<ShiftCell key={props.itoId+"_shift_"+j} content={itoShift}/>);
        j++;
    })
    for (var i=shiftCellList.length;i<31;i++){
        shiftCellList.push(<RosterTableCell key={props.key+"_shift_"+i} />);
    }
    return(
        <tr>
            <NameCell content={content}/>
            {shiftCellList}
            <RosterTableCell className="text-center" content={props.itoRoster.totalHour}/>
            <RosterTableCell className="text-center" content={props.itoRoster.actualHour}/>
            <BalanceCell content={props.itoRoster.lastMonthBalance}/>
            <BalanceCell content={props.itoRoster.thisMonthHourTotal}/>
            <BalanceCell content={props.itoRoster.thisMonthBalance}/>
            <ShiftCountCell content={props.itoRoster.aShiftCount}/>
            <ShiftCountCell content={props.itoRoster.bxShiftCount}/>
            <ShiftCountCell content={props.itoRoster.cShiftCount}/>
            <ShiftCountCell content={props.itoRoster.dxShiftCount}/>
            <ShiftCountCell content={props.itoRoster.noOfWorkingDay} className="tailCell"/>
        </tr>
    );
  }
export default RosterRow;