export default function ShiftCell(props) {
    let {
        children, cssClassName, editable,
        onBlur, onCopy, onMouseDown, onMouseEnter, onMouseLeave, onPaste,
        setIsHighLightRow, updateHighLightCellIndex
    }=props;    
    let className = "borderCell position-relative shiftCell " + cssClassName;
    function deHighLight(e) {
        if (setIsHighLightRow) {
            setIsHighLightRow(false);
        }
        if (updateHighLightCellIndex) {
            updateHighLightCellIndex(-1);
        }
        if (onMouseLeave) {
            onMouseLeave();
        }
    }
    function highLight(e) {
        if (setIsHighLightRow) {
            setIsHighLightRow(true);
        }
        if (updateHighLightCellIndex) {
            updateHighLightCellIndex(e.target.cellIndex);
        }
        if (onMouseEnter) {
            onMouseEnter();
        }
    }

    return (
        <td
            className={className}
            onBlur={onBlur}
            onCopy={onCopy}
            onMouseDown={onMouseDown}
            onMouseEnter={highLight}
            onMouseLeave={deHighLight}
            onPaste={onPaste}
            suppressContentEditableWarning={true}>            
            {children}            
        </td>
    );
}