import RosterTableCell from '../../cells/rosterTableCell/RosterTableCell';
function DateCell(props){
    let className="text-center";
    
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
        <RosterTableCell className={className} content={dateOfMonth}/>
    )
}
export default DateCell