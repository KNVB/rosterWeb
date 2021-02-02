import RosterTableCell from '../../cells/rosterTableCell/RosterTableCell';
function DateCell(props){
    let className="p-0 text-center";
    
    let dateData=props.dateData;
    let dateOfMonth="";
    if (dateData){
        dateOfMonth=dateData.dateOfMonth;
        if (dateData.today)
            className+=" todayCell";
        if (dateOfMonth===props.hightLightCellIndex)
            className+=" highlightCell";
    }
    return (
        <RosterTableCell className={className}>
            {dateOfMonth}
        </RosterTableCell>    
    )
}
export default DateCell