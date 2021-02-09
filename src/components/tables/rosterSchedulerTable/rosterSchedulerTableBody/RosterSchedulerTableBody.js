import Utility from '../../../../utils/Utility';
import RosterSchedulerRow  from './RosterSchedulerRow';
export default function RosterSchedulerTableBody(props){
  let rosterRowList=[];
  //console.log(props);
    
  Object.keys(props.rosterData).forEach(itoId=>{
      let result=Utility.calculateShiftStat(props.noOfWorkingDay,props.rosterData[itoId],props.shiftInfoList);
      //console.log(itoId,result);
      
      rosterRowList.push(<RosterSchedulerRow 
                  itoId={itoId} 
                  itoRoster={result} 
                  key={itoId}
                  noOfPrevDate={props.noOfPrevDate}                  
                  setHightLightCellIndex={props.setHightLightCellIndex}
                  shiftInfoList={props.shiftInfoList} />);
                  
    });  
    return (
        <tbody>
          {rosterRowList}
        </tbody>
    )
}