import {useContext} from 'react';
import './EditableCell.css';
import BorderedAlignCenterCell from './BorderedAlignCenterCell'
import RosterWebContext from '../../../../utils/RosterWebContext';
import UndoableData from '../UndoableData';
export default function PreferredShiftCell(props){
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
        e.preventDefault();
        //console.log(e.target.textContent);
        let preferredShiftList=contextValue.preferredShiftList[props.itoId];
        if (preferredShiftList){

        }else {
            if (e.target.textContent!=''){
                let index=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
                contextValue.preferredShiftList[props.itoId]=new UndoableData({index:e.target.textContent});
                updateContext({type:'updatePreferredShift',value:contextValue.preferredShiftList});
            }
        }
    }
    return(
        <BorderedAlignCenterCell 
            className={cssClass}
            contentEditable={true}
            onBlur={updateValue}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            suppressContentEditableWarning={true}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}