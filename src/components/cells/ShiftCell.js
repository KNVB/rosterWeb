export default function ShiftCell(props){
    let {cssClassName,children}=props;
    let className="borderCell shiftCell "+cssClassName;
    return (
        <td 
            className={className}>
            {children}
        </td>
    )
}