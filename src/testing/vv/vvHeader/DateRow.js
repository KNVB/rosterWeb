import {useContext} from 'react';
import './DateCell.css';
import DateCell from './DateCell';
import BalanceCell from './BalanceCell';
import NameCell from '../cell/NameCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import ShiftCountCell from './ShiftCountCell';
export default function DateRow(props){
    let dateRow=[];
    let {monthlyCalendar} = useContext(RosterWebContext);
    //if (monthlyCalendar){
        for (let i=props.noOfPrevDate;i>0;i--){
            dateRow.push(
                <DateCell key={"date_-"+i}/>    
            )
        }
        for (let i=0;i<31;i++){
            if (monthlyCalendar.calendarDateList[i]){
                dateRow.push(<DateCell 
                                dateData={monthlyCalendar.calendarDateList[i]}
                                key={"date_"+i}
                                noOfPrevDate={props.noOfPrevDate}/>);
            } else {
                dateRow.push(<DateCell key={"date_"+i}/>);
            }
        }
    //}    
    return (
        <tr>
            <NameCell>
                Resident Support<br/>Team Members
            </NameCell>
            {dateRow}
            <BalanceCell>Last<br/>Month</BalanceCell>
            <BalanceCell>This<br/>Month</BalanceCell>
            <BalanceCell>Total</BalanceCell>
            <ShiftCountCell>Total No. of<br/>A Shift</ShiftCountCell>
            <ShiftCountCell>Total No. of<br/>Bx Shift</ShiftCountCell>
            <ShiftCountCell>Total No. of<br/>C Shift</ShiftCountCell>
            <ShiftCountCell>Total No. of<br/>Dx Shift</ShiftCountCell>
            <ShiftCountCell className="tailCell">No. of <br/>working<br/>day</ShiftCountCell>            
        </tr>
    )
}