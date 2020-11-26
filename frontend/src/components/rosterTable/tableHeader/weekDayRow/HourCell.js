import RosterTableCell from '../../rosterTableCell/RosterTableCell';
function HourCell(props){
    return (
        <RosterTableCell className="hourClass text-center" content={props.content}/>
    )
}
export default HourCell;