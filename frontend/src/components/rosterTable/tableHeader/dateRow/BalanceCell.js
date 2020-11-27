import './BalanceCell.css';
import RosterTableCell from '../../rosterTableCell/RosterTableCell';
function BalanceCell(props){
    return (
        <RosterTableCell className="balanceCell text-center" content={props.content}/>
    )
}
export default BalanceCell;