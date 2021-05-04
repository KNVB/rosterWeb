import {useContext} from 'react';
import './EditableShiftCell.css';
import ShiftCell from './ShiftCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function EditableShiftCell(props){
    let {selectedRegionUtil,undoableRosterList,updateContext}=useContext(RosterWebContext);
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
        selectedRegionUtil.pasteCopiedRegion(e.clipboardData,undoableRosterList);
        console.log(undoableRosterList);
        updateContext({type:'updateRoster',value:undoableRosterList});
    }
    return(
        <ShiftCell
            {...props}
            contentEditable={true}
            onCopy={copyData}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            onPaste={pasteData}
            suppressContentEditableWarning={true}>
            {props.children}
        </ShiftCell>
    )
}