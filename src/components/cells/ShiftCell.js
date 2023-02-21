export default function ShiftCell({ cssClassName, editable,
    onBlur, onCopy, onMouseDown, onMouseEnter, onMouseLeave, onPaste,
    setIsHighLightRow, shift, updateHighLightCellIndex }) {
    let contentEditable = false;
    let className = "border shiftCell ";
    let textContent = "";
    if (editable) {
        contentEditable = editable;
    }
    if (shift) {
        className += " " + cssClassName;
        textContent = shift;
    }
    function deHighLight(e) {
        if (setIsHighLightRow) {
            setIsHighLightRow(false);
        }
        if (updateHighLightCellIndex) {
            updateHighLightCellIndex(-1);
        }
        if (onMouseLeave){
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
            contentEditable={contentEditable}
            className={className}
            onBlur={onBlur}
            onCopy={onCopy}
            onMouseDown={onMouseDown}            
            onMouseEnter={highLight}
            onMouseLeave={deHighLight}
            onPaste={onPaste}
            suppressContentEditableWarning={true}>
            {textContent}
        </td>
    );
}