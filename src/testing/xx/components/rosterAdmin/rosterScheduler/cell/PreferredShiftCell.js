import {useContext} from 'react';
import BorderedAlignCenterCell from '../../../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import "./EditableCell.css";
import './EditableShiftCell.css';
export default function PreferredShiftCell(props){
    let className="editableCell "+((props.className)?" "+props.className:"");
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
        props.setIsHighLightRow(true);
        contextValue.selectedRegionUtil.updateSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    }
    let mouseLeaveHandler=(e)=>{
        props.setIsHighLightRow(false);
    }
    let pasteData=e=>{
        if (contextValue.selectedRegionUtil.hasCopiedRegion){
            contextValue.selectedRegionUtil.pasteCopiedRegion(
                e.clipboardData,
                contextValue.activeShiftInfoList,
                contextValue.monthlyCalendar.noOfWorkingDay,
                contextValue.itoRosterList,
                contextValue.systemParam.noOfPrevDate
            );
            updateContext({type:'updateRosterData', value:contextValue.itoRosterList})
        }   
    }
    let updateValue=e=>{
        let cellIndex=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
        let temp=JSON.parse(JSON.stringify(contextValue.itoRosterList.presentValue));
        let oldValue=temp[props.itoId].preferredShiftList[cellIndex];
        if (oldValue){
            if (oldValue!==e.target.textContent){
                temp[props.itoId].preferredShiftList[cellIndex]=e.target.textContent;
                console.log('YYCell.updateValue');
                contextValue.itoRosterList.set(temp);
                updateContext({type:'updateRosterData', value:contextValue.itoRosterList});
            }
        }else {
            if (e.target.textContent!==''){
                temp[props.itoId].preferredShiftList[cellIndex]=e.target.textContent;
                console.log('YYCell.updateValue');
                contextValue.itoRosterList.set(temp);
                updateContext({type:'updateRosterData', value:contextValue.itoRosterList});
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
            onMouseLeave={mouseLeaveHandler}
            onPaste={pasteData}
            suppressContentEditableWarning={true}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}