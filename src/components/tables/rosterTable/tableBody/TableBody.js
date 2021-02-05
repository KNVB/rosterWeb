import RosterRow from './RosterRow';
import Utility from '../../../../utils/Utility';
function TableBody(props){
    let rosterList=[];
    //console.log(props);
    Object.keys(props.rosterData).forEach(itoId=>{
        let result=Utility.calculateShiftStat(props.monthlyCalendarnoOfWorkingDay,props.rosterData[itoId],props.rosterParam.shiftHourCount);
        //console.log(itoId,result);
        rosterList.push(<RosterRow 
                    itoId={itoId} 
                    itoRoster={result} 
                    key={itoId}
                    noOfPrevDate={props.noOfPrevDate} 
                    setHightLightCellIndex={props.setHightLightCellIndex}/>);
      });
    
    return (
        <tbody>
          {rosterList}
        </tbody>
    )
}
export default TableBody;