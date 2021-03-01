import BalanceCell from '../../../../cells/balanceCell/BalanceCell';
export default function EditableBalanceCell(props){
    return (
        <BalanceCell
          {...props}
          contentEditable={true}     
          suppressContentEditableWarning={true}
        >
          {props.children}
        </BalanceCell>
    );
}