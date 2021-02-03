import './BalanceCell.css';
import RosterTableCell from '../rosterTableCell/RosterTableCell';
function BalanceCell(props){
    return (
        <RosterTableCell className="balanceCell p-0 text-center">
            {props.children}
        </RosterTableCell>    
    )
}
export default BalanceCell;