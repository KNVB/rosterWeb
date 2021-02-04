import './DateCell.css';
import DateCell from './DateCell';
import BalanceCell from '../../cells/balanceCell/BalanceCell';
import NameCell from '../../cells/nameCell/NameCell';
import ShiftCountCell from '../../cells/shiftCountCell/ShiftCountCell';
function DateRow(props){
    let dateRow=[];
    let monthlyCalendar=props.monthlyCalendar;

    console.log(props.hightLightCellIndex);
    for (let i=0;i<31;i++){
        if (monthlyCalendar.calendarDateList[i]){
            dateRow.push(<DateCell dateData={monthlyCalendar.calendarDateList[i]} hightLightCellIndex={props.hightLightCellIndex} key={"date_"+i}/>);
        } else {
            dateRow.push(<DateCell key={"date_"+i}/>);
        }
    }
    dateRow.push(<BalanceCell key="lastMonth">Last<br/>Month</BalanceCell>);
    dateRow.push(<BalanceCell key="thisMonth">This<br/>Month</BalanceCell>);
    dateRow.push(<BalanceCell key="total">Total</BalanceCell>);

    dateRow.push(<ShiftCountCell key="totalAShiftCount">Total No. of<br/>A Shift</ShiftCountCell>);
    dateRow.push(<ShiftCountCell key="totalBxShiftCount">Total No. of<br/>Bx Shift</ShiftCountCell>);

    dateRow.push(<ShiftCountCell key="totalCShiftCount">Total No. of<br/>C Shift</ShiftCountCell>);
    dateRow.push(<ShiftCountCell key="totalDxShiftCount">Total No. of<br/>Dx Shift</ShiftCountCell>);

    dateRow.push(<ShiftCountCell key="noOfWorkingDay" className="tailCell" >No. of <br/>working<br/>day</ShiftCountCell>);
    return (
        <tr>
            <NameCell>
                Resident Support<br/>Team Members
            </NameCell>
            {dateRow}            
        </tr>
    )
}
export default DateRow;