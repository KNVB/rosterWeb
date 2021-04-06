export default function QQRow(props){
    let calendarDateList=props.monthlyCalendar.calendarDateList;
    let cellList=[];
    let deHightLight = e => {
        props.setHightLightCellIndex(-1);
    }
    let hightLight = e => {
        props.setHightLightCellIndex(e.target.cellIndex);
    }
    let mouseDownHandler=e=>{

    }
    let updateShiftData=e=>{

    }
    console.log(props.itoRoster);
    
    let shiftList=props.itoRoster.shiftList;
    for (let i=0;i<calendarDateList.length;i++){
        let shiftType=shiftList[i+1];
        cellList.push(
            <td key={props.itoRoster.itoId+"_"+i}
                contentEditable={true}
                onBlur={updateShiftData}
                onMouseLeave={deHightLight}
                onMouseEnter={hightLight}
                onMouseDown={mouseDownHandler}
                suppressContentEditableWarning={true}>
                    {shiftType}
            </td>
        );
    }
    return(
        <tr>
            {cellList}
        </tr>
    )
}