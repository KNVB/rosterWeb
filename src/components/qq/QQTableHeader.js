export default function QQTableHeader(props){
    //console.log(props.rosterTableData.monthlyCalendar)
    let calendarDateList=props.rosterTableData.monthlyCalendar.calendarDateList;
    let cellList=[];

    for (let i=0;i<calendarDateList.length;i++){
        if (props.hightLightCellIndex===i){
            cellList.push(
                <td className="highlightCell" key={"date_"+i}>{i+1}</td>
            )
        } else {
            cellList.push(
                <td  key={"date_"+i}>{i+1}</td>
            )
        }
        
    }
    return(
        <thead>
            <tr>
                {cellList}
            </tr>
        </thead>
    )
}