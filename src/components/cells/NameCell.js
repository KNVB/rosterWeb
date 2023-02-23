export default function NameCell(props){
    return(
        <td className={"nameCell ps-1"+((props.border)?" borderCell":"") + (props.isHighLight ? " highlightCell" : "")}>
            {props.children}
        </td>
    )
}