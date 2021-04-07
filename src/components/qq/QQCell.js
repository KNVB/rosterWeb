import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import SelectedRegionUtil from '../../utils/SelectedRegionUtil';
export default function QQCell(props){
    let cssClassName="QQ";
    let {
        selectedRegion,
        setSelectedRegion
    } = useContext(RosterWebContext);
    const editableShiftCellProps=Object.assign({},props);
    cssClassName=cssClassName+' '+props.className;
    delete editableShiftCellProps.className;
    delete editableShiftCellProps.cellIndex;
    delete editableShiftCellProps.rowIndex;
    function mouseDownHandler(e){
        SelectedRegionUtil.startSelect(e.target,selectedRegion,setSelectedRegion);
    }
    function mouseEnterHandler(e){
        props.onMouseEnter(e);
        SelectedRegionUtil.updateSelect(e.target, selectedRegion,setSelectedRegion);
    }
    return (
        <td {...editableShiftCellProps}
            className={cssClassName}
            contentEditable={true}           
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            suppressContentEditableWarning={true}>
                {props.children}
        </td>
    )
}