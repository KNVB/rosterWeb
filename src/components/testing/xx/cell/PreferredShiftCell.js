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
        
        let preferredShiftList=contextValue.rosterData.presentValue[props.itoId].preferredShiftList;
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        let index=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
        if (preferredShiftList){
            let oldValue= preferredShiftList[index];
            if ((oldValue)&& (e.target.textContent!==oldValue)){
                temp[props.itoId].preferredShiftList[index]=e.target.textContent;
                contextValue.rosterData.set(temp);
                updateContext({type:'updateRosterData',value:contextValue.rosterData});
            }else {
                if (oldValue===undefined){
                    temp[props.itoId].preferredShiftList[index]=e.target.textContent;
                    contextValue.rosterData.set(temp);
                    updateContext({type:'updateRosterData',value:contextValue.rosterData});
                }
            }
        }else {
            if (e.target.textContent!=''){
                temp[props.itoId].preferredShiftList={index:e.target.textContent};
                contextValue.rosterData.set(temp);
                updateContext({type:'updateRosterData',value:contextValue.rosterData});
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