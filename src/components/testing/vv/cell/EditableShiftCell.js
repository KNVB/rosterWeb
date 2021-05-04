import {useContext} from 'react';
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import './EditableShiftCell.css';
import './ShiftCell.css';
export default function EditableShiftCell(props){
    let {selectedRegionUtil,undoableRosterList,updateContext}=useContext(RosterWebContext);
    function copyData(e){
        e.preventDefault();
        selectedRegionUtil.copySelectedRegion(e.clipboardData);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function mouseDownHandler(e){
        e.preventDefault();
        selectedRegionUtil.startSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil})
    }
    function mouseEnterHandler(e){
        selectedRegionUtil.updateSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function pasteData(e){
        e.preventDefault();
        selectedRegionUtil.pasteCopiedRegion(e.clipboardData,undoableRosterList);
        console.log(undoableRosterList);
        updateContext({type:'updateRoster',value:undoableRosterList});
    }
    function updateValue(e){
        let temp=JSON.parse(JSON.stringify(undoableRosterList.presentValue));
        temp[props.itoId].shiftList[e.target.cellIndex]=e.target.textContent;
        undoableRosterList.set(temp);
        updateContext({type:'updateRoster',value:undoableRosterList});
    }
    return(
        <BorderedAlignCenterCell
            className={props.className+" shiftCell"}
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