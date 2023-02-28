import ShiftCell from "../../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {children,cssClassName,onBlur,selected, setIsHighLightRow,updateHighLightCellIndex,updateSelectedRegion}=props;
    cssClassName+=" position-relative";
    return (
        <ShiftCell
            cssClassName={cssClassName}            
            onBlur={onBlur}
            onMouseEnter={updateSelectedRegion}
            setIsHighLightRow={setIsHighLightRow}            
            updateHighLightCellIndex={updateHighLightCellIndex}>
                <div>
                    <div 
                        className="shiftType" 
                        contentEditable={true}
                        suppressContentEditableWarning={true}>
                            {children}
                    </div>
                    <div className="littleSquareDiv"></div>
                </div>
                {
                    selected &&
                    <div className="selected">&nbsp;</div>
                }
        </ShiftCell>        
    );
}