export default function ShiftCell(props){
    let {cssClassName,children, onMouseDown, onMouseEnter,onMouseLeave,onPaste,title}=props;
    let className=["borderCell","shiftCell"];
    if (cssClassName !== undefined){
        className.push(cssClassName);
    }
    return (
        <td             
            className={className.join(" ")}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPaste={onPaste}
            title={title}>
            {children}
        </td>
    )
}