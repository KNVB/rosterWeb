import './BalanceCell.css';
import BorderedAlignCenterCell from '../../cell/BorderedAlignCenterCell';
export default function BalanceCell(props){
    return (
        <BorderedAlignCenterCell {...props} className="balanceCell p-0">
            {props.children}
        </BorderedAlignCenterCell>    
    )
}