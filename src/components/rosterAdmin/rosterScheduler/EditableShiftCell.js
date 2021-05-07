import {useContext} from 'react';
import './EditableShiftCell.css';
import ShiftCell from '../../cell/ShiftCell';
import RosterWebContext from '../../../utils/RosterWebContext';
export default function EditableShiftCell(props){
    let {selectedRegionUtil,systemParam,undoableRosterSchedulerList,updateContext}=useContext(RosterWebContext);
    //console.log(props);
    function copyData(e){
        e.preventDefault();
        selectedRegionUtil.copySelectedRegion(e.clipboardData);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function mouseEnterHandler(e){
        e.preventDefault();
        selectedRegionUtil.updateSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function mouseDownHandler(e){
        e.preventDefault();
        selectedRegionUtil.startSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil})
    }
    function pasteData(e){
        e.preventDefault();
        selectedRegionUtil.pasteCopiedRegion(e.clipboardData,undoableRosterSchedulerList);
        console.log(undoableRosterSchedulerList);
        updateContext({type:'updateRoster',value:undoableRosterSchedulerList});
    }
    
    function updateValue(e){
        console.log("ShiftCell:updateValue");
        let oldValue=undoableRosterSchedulerList.presentValue.rosterList[props.itoId].shiftList[e.target.cellIndex-systemParam.noOfPrevDate];
        if (oldValue!==e.target.textContent){ 
            /****************************************************************/
            /*The following steps are consuming very hight computing power, */
            /*so if the value not change do not execute the following step. */
            /****************************************************************/
            let temp=JSON.parse(JSON.stringify(undoableRosterSchedulerList.presentValue));
            temp.rosterList[props.itoId].shiftList[e.target.cellIndex-systemParam.noOfPrevDate]=e.target.textContent;
            undoableRosterSchedulerList.set(temp);        
            updateContext({type:'updateRoster',value:undoableRosterSchedulerList});
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