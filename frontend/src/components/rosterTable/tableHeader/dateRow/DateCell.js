import RosterTableCell from '../../cells/rosterTableCell/RosterTableCell';
function DateCell(props){
    let className="text-center";
    
    let dateData=props.dateData;
    if (dateData.today)
        className+=" todayCell";
    
    return (
        <RosterTableCell className={className} content={dateData.dateOfMonth}/>
    )
}
export default DateCell