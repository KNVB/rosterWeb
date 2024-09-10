import "../CalendarPicker.css";
import "./CalendarTable.css";
export default function CalendarTable({
    bigPrev,
    bigNext,
    bodyRow,
    headerRow,
    getSelectedItem,
    selectedItem,
    smallPrev,
    smallNext,
    title
}) {
    let isNull = obj => {
        if ((obj === undefined) || (obj === null)) {
            return true
        }
        return false
    }
    let colCount, colSpan;
    colCount = (isNull(headerRow) ? bodyRow.rowList[0].length : headerRow.columnList.length);
    colSpan = colCount;
    if (!isNull(bigNext)) {
        colSpan--;
    }
    if (!isNull(smallNext)) {
        colSpan--;
    }
    if (!isNull(bigPrev)) {
        colSpan--;
    }
    if (!isNull(smallPrev)) {
        colSpan--;
    }

    return (
        <table className="calendarTable">
            <thead>
                <tr>
                    {
                        (!isNull(bigPrev)) &&
                        <td className="clickable" onClick={bigPrev}>&lt;&lt;</td>
                    }
                    {
                        (!isNull(smallPrev)) &&
                        <td className="clickable" onClick={smallPrev}>&lt;</td>
                    }
                    <td colSpan={colSpan}>{title}</td>
                    {
                        (!isNull(smallNext)) &&
                        <td className="clickable" onClick={smallNext}>&gt;</td>
                    }
                    {
                        (!isNull(bigNext)) &&
                        <td className="clickable" onClick={bigNext}>&gt;&gt;</td>
                    }
                </tr>
                {
                    headerRow &&
                    <tr className={(headerRow.className??null)}>
                        {
                            headerRow.columnList.map((headerColumn, index) => (
                                <td className={(headerColumn.className??null)} key={"calendartable_header_row_" + index}>{headerColumn.value}</td>
                            ))
                        }
                    </tr>
                }                
            </thead>
            <tbody>
                {
                    bodyRow &&
                    bodyRow.rowList.map((row, index) => (
                        <tr className={(row.className??null)} key={"calendartable_body_row_" + index}>
                            {
                                row.map((col, colIndex) => (
                                    <td className={(col.className??null) + (selectedItem === col.value ? " selectedItem" : "")}
                                        key={"calendartable_body_row_" + index + "_col_" + colIndex}
                                        onClick={()=>getSelectedItem(col.value)}>
                                        {col.value}
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
            <tfoot>
                <tr><td colSpan={colCount}></td></tr>
            </tfoot>
        </table>
    )
}