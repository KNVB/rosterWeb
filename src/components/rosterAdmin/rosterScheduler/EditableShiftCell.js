import {useContext} from 'react';
import './EditableShiftCell.css';
import ShiftCell from '../../cell/ShiftCell';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function EditableShiftCell(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    //console.log(props);
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
        let oldValue=contextValue.undoableRosterSchedulerList.presentValue.rosterList[props.itoId].shiftList[e.target.cellIndex-contextValue.systemParam.noOfPrevDate];
        
        if (oldValue!==e.target.textContent){ 
            /****************************************************************/
            /*The following steps are consuming very hight computing power, */
            /*so if the value not change do not execute the following step. */
            /****************************************************************/
            let temp=JSON.parse(JSON.stringify(contextValue.undoableRosterSchedulerList.presentValue));
            temp.rosterList[props.itoId].shiftList[e.target.cellIndex-contextValue.systemParam.noOfPrevDate]=e.target.textContent;
            contextValue.undoableRosterSchedulerList.set(temp);        
            updateContext({type:'updateRoster',value:contextValue.undoableRosterSchedulerList});
        }
    }
    return(
        <ShiftCell
            {...props}
            contentEditable={true}
            onBlur={updateValue}
            onCopy={copyData}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            onPaste={pasteData}
            suppressContentEditableWarning={true}>
            {props.children}
        </ShiftCell>
    )
}