import RosterTableCell from '../../cells/rosterTableCell/RosterTableCell';
function DateCell(props){
    return (
        <RosterTableCell className="text-center" content={props.content}/>
    )
}
export default DateCell