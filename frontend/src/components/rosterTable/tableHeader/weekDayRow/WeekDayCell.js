import RosterTableCell from '../../rosterTableCell/RosterTableCell';
function WeekDayCell(props){
    return (
        <RosterTableCell title={props.title} className={"text-center "+props.className} content={props.content}/>
    )
}
export default WeekDayCell;