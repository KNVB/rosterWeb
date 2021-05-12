import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function PreferredShiftCell(props){
    let cssClass="shiftCell"+((props.className)?" "+props.className:"");
    //console.log("cssClass="+cssClass);
    let [contextValue,updateContext]=useContext(RosterWebContext);

  function copyData(e){
    e.preventDefault();
    contextValue.selectedRegionUtil.copySelectedRegion(e.clipboardData);
    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
  }
  function mouseEnterHandler(e){
      e.preventDefault();
      contextValue.selectedRegionUtil.updateSelect(e.target);
      updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
  }
  function mouseDownHandler(e){
      e.preventDefault();
      contextValue.selectedRegionUtil.startSelect(e.target);
      updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil})
  }
  function pasteData(e){
      e.preventDefault();
      contextValue.selectedRegionUtil.pasteCopiedRegion(e.clipboardData,contextValue.undoableRosterSchedulerList);
      console.log(contextValue.undoableRosterSchedulerList);
      updateContext({type:'updateRoster',value:contextValue.undoableRosterSchedulerList});
  }
  
  function updateValue(e){
      console.log("ShiftCell:updateValue");
      let cellIndex=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
      let preferredShiftList=contextValue.undoableRosterSchedulerList.presentValue.preferredShiftList;
      if (preferredShiftList[props.itoId]){
        let oldValue=preferredShiftList[props.itoId][cellIndex];
        /****************************************************************/
        /*The following steps are consuming very hight computing power, */
        /*so if the value not change do not execute the following step. */
        /****************************************************************/
        if (oldValue!==e.target.textContent){ 
          let temp=JSON.parse(JSON.stringify(contextValue.undoableRosterSchedulerList.presentValue));
          temp.preferredShiftList[props.itoId][cellIndex]=e.target.textContent;
          contextValue.undoableRosterSchedulerList.set(temp);
          updateContext({type:'updateRoster',value:contextValue.undoableRosterSchedulerList});
        }
      }else {
        let temp=JSON.parse(JSON.stringify(contextValue.undoableRosterSchedulerList.presentValue));
        temp.preferredShiftList[props.itoId]={cellIndex:e.target.textContent};
        contextValue.undoableRosterSchedulerList.set(temp);
        updateContext({type:'updateRoster',value:contextValue.undoableRosterSchedulerList});
      }
  }
  return(
      <BorderedAlignCenterCell
          className={cssClass}
          contentEditable={true}
          onBlur={updateValue}
          onCopy={copyData}
          onMouseDown={mouseDownHandler}
          onMouseEnter={mouseEnterHandler}
          onPaste={pasteData}
          suppressContentEditableWarning={true}>
          {props.children}
      </BorderedAlignCenterCell>
  )
}