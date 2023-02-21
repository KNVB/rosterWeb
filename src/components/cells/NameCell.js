export default function NameCell(props){
    return(
        <td className={"nameCell ps-1"+((props.border)?" border":"") + (props.isHighLight ? " highlightCell" : "")}>
            {props.children}
        </td>
    )
}