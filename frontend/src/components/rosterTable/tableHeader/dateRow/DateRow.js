import { Fragment } from 'react';
import DateCell from './DateCell';
import BalanceCell from './BalanceCell';
import NameCell from '../../nameCell/NameCell';
import ShiftCountCell from './ShiftCountCell';
function DateRow(props){
    let dateRow=[];
    for (let i=0;i<31;i++){
        if (props.monthlyCalendar[i]){
            var content=[props.monthlyCalendar[i].dateOfMonth];
            dateRow.push(<DateCell content={content} key={"date_"+i}/>);
        } else {
            dateRow.push(<DateCell key={"date_"+i}/>);
        }
    }
    dateRow.push(<BalanceCell key="lastMonth" content={<Fragment>Last<br/>Month</Fragment>}/>);
    dateRow.push(<BalanceCell key="thisMonth" content={<Fragment>This<br/>Month</Fragment>}/>);
    dateRow.push(<BalanceCell key="total" content="Total"/>);
    dateRow.push(<ShiftCountCell key="totalAShiftCount" content={<Fragment>Total No. of<br/>A Shift</Fragment>}/>);
    dateRow.push(<ShiftCountCell key="totalBxShiftCount" content={<Fragment>Total No. of<br/>Bx Shift</Fragment>}/>);
    dateRow.push(<ShiftCountCell key="totalCShiftCount" content={<Fragment>Total No. of<br/>C Shift</Fragment>}/>);
    dateRow.push(<ShiftCountCell key="totalDxShiftCount" content={<Fragment>Total No. of<br/>Dx Shift</Fragment>}/>);
    dateRow.push(<ShiftCountCell key="noOfWorkingDay" className="tailCell" content={<Fragment>No. of <br/>working<br/>day</Fragment>}/>);
    return (
        <tr>
            <NameCell content={<Fragment>Resident Support<br/>Team Members</Fragment>}/>
            {dateRow}            
        </tr>
    )
}
export default DateRow;