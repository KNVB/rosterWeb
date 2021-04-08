import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import SelectedRegionUtil from '../../utils/SelectedRegionUtil';
export default function QQCell(props){
    let cssClassName="QQ";
    let {
        selectedRegion,
        setCopiedRegion,
        setSelectedRegion
    } = useContext(RosterWebContext);
    const editableShiftCellProps=Object.assign({},props);
    let cssClassList=SelectedRegionUtil.getSelectedRegionCssClass(props.cellIndex,props.rowIndex,selectedRegion);
    cssClassList.push("QQ");
    cssClassList.push(props.className);
    cssClassName=cssClassList.join(' ');
    delete editableShiftCellProps.className;
    delete editableShiftCellProps.cellIndex;
    delete editableShiftCellProps.rowIndex;

    function copyData(e){
        e.preventDefault();
        console.log("Copy");
        SelectedRegionUtil.copySelectedRegion(selectedRegion,setCopiedRegion);
    }
    function mouseClickHandler(e){
        e.preventDefault();
        console.log(window.getSelection());
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
    return (
        <td {...editableShiftCellProps}
            className={cssClassName}
            contentEditable={true}
            onClick={mouseClickHandler}
            onCopy={copyData}    
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            suppressContentEditableWarning={true}>
                {props.children}
        </td>
    )
}