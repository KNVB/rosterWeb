import {useContext} from 'react';
import ITOShiftStatUtil from '../../utils/ITOShiftStatUtil';
import RosterWebContext from '../../utils/RosterWebContext';
import ShiftCell from '../../cell/ShiftCell';
import "./EditableCell.css";
import './EditableShiftCell.css';
export default function EditableShiftCell(props){
    let className="editableCell"+((props.className)?" "+props.className:"");
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let {getITOStat}=ITOShiftStatUtil();
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
            contextValue.selectedRegionUtil.pasteCopiedRegion(
                e.clipboardData,
                contextValue.activeShiftInfoList,
                contextValue.monthlyCalendar.noOfWorkingDay,
                contextValue.itoRosterList,
                contextValue.systemParam.noOfPrevDate,
            );
            updateContext({type:'updateRosterData', value:contextValue.itoRosterList})
        }
    }
    let updateValue=(e)=>{
        let temp=JSON.parse(JSON.stringify(contextValue.itoRosterList.presentValue));
        let realX=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
        let oldValue=temp[props.itoId].shiftList[realX];
        //console.log(oldValue+','+e.target.textContent+'='+(oldValue===e.target.textContent));
        if (oldValue!==e.target.textContent){
            temp[props.itoId].shiftList[realX]=e.target.textContent;
            console.log('XXCell.updateValue');
            temp[props.itoId]=getITOStat(contextValue.activeShiftInfoList,contextValue.monthlyCalendar.noOfWorkingDay, temp[props.itoId]);
            contextValue.itoRosterList.set(temp);
            updateContext({
                type:'updateRosterData', 
                value:contextValue.itoRosterList                
            });
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