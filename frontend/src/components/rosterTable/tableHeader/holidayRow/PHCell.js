import RosterTableCell from '../../../cells/rosterTableCell/RosterTableCell';
function PHCell(props){
    return (
        <RosterTableCell title={props.title} className="font-weight-bold p-0 phCell text-center">
            {props.children}
        </RosterTableCell>
    )
}
export default PHCell;