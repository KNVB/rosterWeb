import {useContext} from 'react';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import "./EditableCell.css";
import './EditableShiftCell.css';
export default function YYCell(props){
    let className="editableCell"+((props.className)?" "+props.className:"");
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
    let updateValue=e=>{
        let cellIndex=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        let oldValue=temp[props.itoId].preferredShiftList[cellIndex];
        if (oldValue){
            if (oldValue!==e.target.textContent){
                temp[props.itoId].preferredShiftList[cellIndex]=e.target.textContent;
                contextValue.rosterData.set(temp);
                updateContext({type:'updateRosterData', value:contextValue.rosterData});
            }
        }else {
            temp[props.itoId].preferredShiftList[cellIndex]=e.target.textContent;
            contextValue.rosterData.set(temp);
            updateContext({type:'updateRosterData', value:contextValue.rosterData});
        }
    }
    return(
        <BorderedAlignCenterCell
            className={className}
            contentEditable={true}
            onBlur={updateValue}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            suppressContentEditableWarning={true}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}