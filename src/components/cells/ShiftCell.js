export default function ShiftCell(props){
    let {cssClassName,children}=props;
    let className=["borderCell","shiftCell"];
    if (cssClassName !== undefined){
        className.push(cssClassName);
    }
    return (
        <td 
            className={className.join(" ")}>
            {children}
        </td>
    )
}