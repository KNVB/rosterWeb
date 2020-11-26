import './RosterTableCell.css';
function RosterTableCell(props){
    let classNames="rosterTableCell";
    console.log(props);
    if (props.className!==null){
        console.log(props.className);
        classNames+=" "+props.className;
    }

    return (
        <td className={classNames}>            
            {props.content}
        </td>
    )
}
export default RosterTableCell;