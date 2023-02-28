import ShiftCell from "../../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {children,cssClassName,onBlur,selected, setIsHighLightRow,updateHighLightCellIndex,updateSelectedRegion}=props;
    cssClassName+=" editableShiftCell m-0 p-0 position-relative";
    function handleMouseLeaveEvent(e) {
        setIsHighLightRow(false);        
        updateHighLightCellIndex(-1);        
    }
    function handleMouseEnterEvent(e) {        
        setIsHighLightRow(true);
        let cell=e.target.parentElement.parentElement;    
        updateHighLightCellIndex(cell.cellIndex);      
    }
    return (
        <ShiftCell
            cssClassName={cssClassName}            
            onBlur={onBlur}
            onMouseEnter={handleMouseEnterEvent}
            onMouseLeave={handleMouseLeaveEvent}
            setIsHighLightRow={setIsHighLightRow}            
            updateHighLightCellIndex={updateHighLightCellIndex}>
                <div className="m-0 p-0">
                    <div 
                        className="m-0 p-0 shiftType" 
                        contentEditable={true}
                        suppressContentEditableWarning={true}>
                        {children}
                    </div>
                    <div className="littleSquareDiv">&nbsp;</div>
                </div>
                {
                    selected &&
                    <div className="selected">&nbsp;</div>
                }
        </ShiftCell>        
    );
}