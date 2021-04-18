import RosterRow from './RosterRow';
export default function P8Body(props){
    let rowList=[];
    let rosterData=props.rosterData;
    let monthlyCalendar=props.monthlyCalendar;

    if (rosterData){
        let itoIdList=Object.keys(rosterData);
        if (monthlyCalendar.calendarDateList.length===Object.keys(rosterData[itoIdList[0]].shiftList).length){
            Object.keys(rosterData).forEach(itoId=>{
                let roster=rosterData[itoId];
                rowList.push(                    
                    <RosterRow 
                        activeShiftInfoList={props.activeShiftInfoList} 
                        itoId={itoId}
                        key={itoId+"_roster"}
                        monthlyCalendar={monthlyCalendar} 
                        roster={roster}
                        rowIndex={rowList.length+3}/>
                )
            })
        }
    }
    return(
        <tbody>
            {rowList}
        </tbody>
    )
}