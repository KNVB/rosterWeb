export default function ShiftCell(props) {
    let {
        children, cssClassName,
        onBlur, onCopy, onFocus,
        onKeyDown,
        onMouseDown, onMouseEnter, onMouseLeave,
        onPaste        
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
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPaste={onPaste}>            
            {children}            
        </td>
    );
}