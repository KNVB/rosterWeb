import {useContext} from 'react';
import RosterWebContext from '../../../../utils/RosterWebContext';
import ShiftCell from './ShiftCell';
import "./EditableCell.css";
import './EditableShiftCell.css';
export default function EditableShiftCell(props){
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
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    }
    let mouseEnterHandler=(e)=>{
        e.preventDefault();
        contextValue.selectedRegionUtil.updateSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    }
    let pasteData=e=>{
        e.preventDefault();
        if (contextValue.selectedRegionUtil.hasCopiedRegion){
            contextValue.selectedRegionUtil.pasteCopiedRegion(e.clipboardData,contextValue.rosterData,contextValue.systemParam.noOfPrevDate);
            updateContext({type:'updateRosterData', value:contextValue.rosterData})
        }
    }
    let updateValue=(e)=>{
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        let realX=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
        let oldValue=temp[props.itoId].rosterList.shiftList[realX];
        //console.log(oldValue+','+e.target.textContent+'='+(oldValue===e.target.textContent));
        if (oldValue!==e.target.textContent){
            temp[props.itoId].rosterList.shiftList[realX]=e.target.textContent;
            console.log('XXCell.updateValue');
            contextValue.rosterData.set(temp);
            updateContext({type:'updateRosterData', value:contextValue.rosterData});
        }
    }
    return (
        <ShiftCell
            {...props}
            contentEditable={true}
            className={className}
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