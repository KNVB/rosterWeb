import {useContext} from 'react';
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegionUtil from '../../../utils/SelectedRegionUtil';
export default function QQCell(props){
    let cssClassName="QQ";
    let {
        copiedRegion,
        rosterData,
        selectedRegion,
        setCopiedRegion,
        setRosterData,
        setSelectedRegion,
        systemParam
    } = useContext(RosterWebContext);
    const editableShiftCellProps=Object.assign({},props);
    let cssClassList=[],cellIndex=props.dateIndex+systemParam.noOfPrevDate;
    SelectedRegionUtil.getCopiedRegionCssClass(cellIndex,props.rowIndex,copiedRegion).forEach(cssClass=>{
        cssClassList.push(cssClass);
    });
    if (cssClassList.length===0){
        SelectedRegionUtil.getSelectedRegionCssClass(cellIndex,props.rowIndex,selectedRegion).forEach(cssClass=>{
            cssClassList.push(cssClass);
        });
    }
    cssClassList.push("QQ");
    cssClassList.push(props.className);
    cssClassName=cssClassList.join(' ');
    delete editableShiftCellProps.className;
    delete editableShiftCellProps.itoId;
    delete editableShiftCellProps.dateIndex;
    delete editableShiftCellProps.rowIndex;

    function copyData(e){
        e.preventDefault();
        console.log("Copy");
        SelectedRegionUtil.copySelectedRegion(e.clipboardData,rosterData,selectedRegion,setCopiedRegion,systemParam);
    }   
    function mouseDownHandler(e){
        e.preventDefault();
        SelectedRegionUtil.startSelect(e.target,selectedRegion,setSelectedRegion);
    }
    function mouseEnterHandler(e){
        e.preventDefault();
        props.onMouseEnter(e);
        SelectedRegionUtil.updateSelect(e.target, selectedRegion,setSelectedRegion);
    }
    function pasteData(e){
        e.preventDefault();
        console.log("Paste");
        SelectedRegionUtil.pasteCopiedData(e.clipboardData,selectedRegion,copiedRegion,setCopiedRegion,setRosterData,systemParam,rosterData)
    }
    function setFocus(e){
        e.preventDefault();
        let sel = window.getSelection();
		let theCell=e.target;
        theCell.focus();
		sel.collapse(theCell, 1);
    }
    return (
        <td {...editableShiftCellProps}
            className={cssClassName}
            contentEditable={true}
            onCopy={copyData}
            onDoubleClick={setFocus}    
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            onPaste={pasteData}
            suppressContentEditableWarning={true}>
                {props.children}
        </td>
    )
}