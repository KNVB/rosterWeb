import {useEffect,useState} from 'react';
import Utility from '../../../../utils/Utility';
import RosterSchedulerRow  from './RosterSchedulerRow';
export default function RosterSchedulerTableBody(props){
  let aShiftCount=[],bShiftCount=[],cShiftCount=[],rosterRowList=[];
  const [rosterList,setRosterList]=useState(props.rosterData.rosterList);
  const [stdDevList,setStdDevList]=useState();
  //console.log(props);
  
  Object.keys(props.rosterData.rosterList).forEach(itoId=>{
      rosterRowList.push(
                <RosterSchedulerRow 
                  key={itoId}
                  noOfWorkingDay={props.noOfWorkingDay}
                  rosterData={props.rosterData.rosterList[itoId]}
                  setHightLightCellIndex={props.setHightLightCellIndex}
                  shiftInfoList={props.shiftInfoList} />);                  
    });  

    return (
        <tbody>
          {rosterRowList}
        </tbody>
    )
}