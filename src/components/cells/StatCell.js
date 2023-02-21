export default function StatCell(props) {
    return (
        <td className="statCell border text-center"
            colSpan={props.colSpan}
            contentEditable={props.editable}
            onBlur={props.onBlur}
            rowSpan={props.rowSpan}
            suppressContentEditableWarning={true}>
            {props.children}
        </td>
    )
}