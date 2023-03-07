import RosterRow from '../tables/rosterTable/tableBody/RosterRow';
import Utility from '../../utils/Utility';
export default function CC(props){
    let rosterRowList=[];
    console.log(props);
    
    Object.keys(props.rosterData).forEach(itoId=>{
        let result=Utility.calculateShiftStat(props.noOfWorkingDay,props.rosterData[itoId],props.rosterParam.shiftHourCount);
        //console.log(itoId,result);
        rosterRowList.push(<RosterRow 
                    itoId={itoId} 
                    itoRoster={result} 
                    key={itoId}
                    noOfPrevDate={props.noOfPrevDate} 
                    setHightLightCellIndex={props.setHightLightCellIndex}/>);
      });
      
    return(
        <tbody>
            {rosterRowList}
        </tbody>
    )
}