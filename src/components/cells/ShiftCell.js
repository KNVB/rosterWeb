export default function ShiftCell(props) {
    let {
        children, cssClassName,
        onBlur, onCopy, onMouseDown,
        onMouseEnter, onMouseLeave, onPaste        
    }=props;  
    let className = "borderCell shiftCell";
    if (cssClassName){
        className+=" "+cssClassName;
    }    
    return (
        <td
            className={className}
            onBlur={onBlur}
            onCopy={onCopy}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPaste={onPaste}
            suppressContentEditableWarning={true}>            
            {children}            
        </td>
    );
}