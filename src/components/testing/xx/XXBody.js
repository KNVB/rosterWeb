import XXRow from './XXRow';
import {useCallback, useContext,useEffect } from "react";
import RosterWebContext from '../../../utils/RosterWebContext';
export default function XXBody(props){
  let [contextValue,updateContext]=useContext(RosterWebContext);
  let rowList=[];
  
  Object.keys(contextValue.rosterList).forEach(itoId=>{
    rowList.push(
      <XXRow itoId={itoId} key={itoId} rowIndex={rowList.length+3}/>
    )
  })
  let mouseUp=useCallback((e)=>{
      console.log("mouse up");
      contextValue.selectedRegionUtil.endSelect();
      updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
  },[contextValue.selectedRegionUtil,updateContext]);
  useEffect(()=>{
      document.addEventListener('mouseup',mouseUp);
      return () => {
          document.removeEventListener('mouseup', mouseUp)
      }
  },[mouseUp]);
  return(
    <tbody>
      {rowList}
    </tbody>
  )
}