import {useContext} from 'react';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import "./EditableCell.css";
import './EditableShiftCell.css';
export default function YYCell(props){
    let className="editableCell"+((props.className)?" "+props.className:"");
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let copyData=(e)=>{
        e.preventDefault();
        contextValue.selectedRegionUtil.copySelectedRegion(e.clipboardData);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    }
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
    let pasteData=e=>{
        if (contextValue.selectedRegionUtil.hasCopiedRegion){
            contextValue.selectedRegionUtil.pasteCopiedRegion(e.clipboardData,contextValue.rosterData,contextValue.systemParam.noOfPrevDate);
            updateContext({type:'updateRosterData', value:contextValue.rosterData})
        }   
    }
    let updateValue=e=>{
        let cellIndex=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        let oldValue=temp[props.itoId].preferredShiftList[cellIndex];
        if (oldValue){
            if (oldValue!==e.target.textContent){
                temp[props.itoId].preferredShiftList[cellIndex]=e.target.textContent;
                console.log('YYCell.updateValue');
                contextValue.rosterData.set(temp);
                updateContext({type:'updateRosterData', value:contextValue.rosterData});
            }
        }else {
            if (e.target.textContent!==''){
                temp[props.itoId].preferredShiftList[cellIndex]=e.target.textContent;
                console.log('YYCell.updateValue');
                contextValue.rosterData.set(temp);
                updateContext({type:'updateRosterData', value:contextValue.rosterData});
            }
        }
    }
    return(
        <BorderedAlignCenterCell
            className={className}
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