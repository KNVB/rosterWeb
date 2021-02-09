import Utility from '../../../../utils/Utility';
import RosterRow from './RosterRow';
function TableBody(props){
  let rosterRowList=[];
  //console.log(props);
    
  Object.keys(props.rosterData).forEach(itoId=>{
      let result=Utility.calculateShiftStat(props.noOfWorkingDay,props.rosterData[itoId],props.shiftInfoList);
      //console.log(itoId,result);
      rosterRowList.push(<RosterRow 
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
export default TableBody;