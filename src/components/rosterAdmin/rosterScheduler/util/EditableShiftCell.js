import ShiftCell from "../../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    let {children,cssClassName,onBlur, setIsHighLightRow,updateHighLightCellIndex,updateSelectedRegion}=props;
    cssClassName+=" editableShiftCell";
    return (
        <ShiftCell
            cssClassName={cssClassName}
            editable           
            onBlur={onBlur}
            onMouseEnter={updateSelectedRegion}
            setIsHighLightRow={setIsHighLightRow}            
            updateHighLightCellIndex={updateHighLightCellIndex}>
                {children}
        </ShiftCell>        
    );
}