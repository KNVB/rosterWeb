import RosterTableCell from '../../rosterTableCell/RosterTableCell';
function PHCell(props){
    return (
        <RosterTableCell title={props.title} className="font-weight-bold phCell text-center" content={props.content}/>
    )
}
export default PHCell;