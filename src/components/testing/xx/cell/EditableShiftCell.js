import {useContext} from 'react';
import './EditableCell.css';
import './EditableShiftCell.css';
import ShiftCell from '../cell/ShiftCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function EditableShiftCell(props){
    let cssClass="editableCell"+((props.className)?" "+props.className:"");
    let [contextValue, updateContext]=useContext(RosterWebContext);
    
    let mouseDownHandler=(e)=>{
        e.preventDefault();
        contextValue.selectedRegionUtil.startSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil})
    }
    let mouseEnterHandler=(e)=>{
        e.preventDefault();
        contextValue.selectedRegionUtil.updateSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    }
    let updateValue=(e)=>{
        //console.log(e.target.textContent);
        e.preventDefault();
        let oldValue=contextValue.rosterData.presentValue[props.itoId].rosterList.shiftList[e.target.cellIndex-contextValue.systemParam.noOfPrevDate];
        /****************************************************************/
        /*The following steps are consuming very high computing power, */
        /*so if the value not change do not execute the following step. */
        /****************************************************************/
        if (e.target.textContent!==oldValue){
            let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
            temp[props.itoId].rosterList.shiftList[e.target.cellIndex-contextValue.systemParam.noOfPrevDate]=e.target.textContent;
            contextValue.rosterData.set(temp);
            updateContext({type:'updateRosterData',value:contextValue.rosterData});
        }
    } 
    return (
        <ShiftCell 
            {...props}
            className={cssClass}
            contentEditable={true}            
            onBlur={updateValue}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            suppressContentEditableWarning={true}>
            {props.children}
        </ShiftCell>    
    )
}