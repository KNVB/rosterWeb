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
    let colSpan = headerRow.columnList.length;
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
                {
                    (colSpan !== headerRow.columnList.length) &&
                    <tr>
                        <td className="clickable" onClick={bigPrev}>&lt;&lt;</td>
                        <td className="clickable" onClick={smallPrev}>&lt;</td>
                        <td colSpan={colSpan}>{title}</td>
                        <td className="clickable" onClick={smallNext}>&gt;</td>
                        <td className="clickable" onClick={bigNext}>&gt;&gt;</td>
                    </tr>
                }
                {
                    headerRow &&
                    <tr className={headerRow.className}>
                        {
                            headerRow.columnList.map((headerColumn, index) => (
                                <td className={headerColumn.className} key={"calendartable_header_row_" + index}>{headerColumn.value}</td>
                            ))
                        }
                    </tr>
                }
            </thead>
            <tbody>
                {
                    bodyRow &&
                    bodyRow.rowList.map((row, index) => (
                        <tr className={row.className} key={"calendartable_body_row_" + index}>
                            {
                                row.map((col, colIndex) => (
                                    <td className={col.className + (selectedItem === col.value ? " selectedItem" : "")}
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
        </table>
    )
}