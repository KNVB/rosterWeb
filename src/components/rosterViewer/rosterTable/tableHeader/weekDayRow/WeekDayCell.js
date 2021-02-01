import RosterTableCell from '../../../../commonTableComponent/cells/rosterTableCell/RosterTableCell';
function WeekDayCell(props){
    return (
        <RosterTableCell title={props.title} className={"p-0 text-center "+props.className}>
            {props.children}
        </RosterTableCell>    
    )
}
export default WeekDayCell;