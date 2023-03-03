import { useState } from "react";
import "./EditableShiftCell.css";
import ShiftCell from "../../../cells/ShiftCell";
export default function EditableShiftCell(props) {
    const [isFocus, updateFocus] = useState(false);
    let { children, cssClassName, onBlur, onMouseDown, onMouseEnter, onMouseLeave } = props;
    cssClassName += " editableShiftCell m-0 p-0 position-relative";
    let blur = e => {
        updateFocus(false);
        onBlur(e);
    }
    let setFocus = e => {
        updateFocus(true);
    }
    return (
        <ShiftCell
            cssClassName={cssClassName}
            onBlur={blur}
            onFocus={setFocus}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <div className="m-0 p-0">
                <div
                    className="m-0 p-0 shiftType"
                    contentEditable={true}
                    suppressContentEditableWarning={true}>
                    {children}
                </div>
                {
                    isFocus &&
                    <div className="littleSquareDiv">&nbsp;</div>
                }
            </div>
        </ShiftCell>
    );
}