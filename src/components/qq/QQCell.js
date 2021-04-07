import {useContext} from 'react';
import RosterWebContext from '../../utils/RosterWebContext';
import SelectedRegionUtil from '../../utils/SelectedRegionUtil';
export default function QQCell(props){
    let cssClassName="QQ";
    let {
        selectedRegion,
        setSelectedRegion
    } = useContext(RosterWebContext);
    function mouseDownHandler(e){
        SelectedRegionUtil.startSelect(e.target,selectedRegion,setSelectedRegion);
    }
    function mouseEnterHandler(e){
        props.onMouseEnter(e);
        SelectedRegionUtil.updateSelect(e.target, selectedRegion,setSelectedRegion);
    }
    function updateShiftData(e){
        props.onBlur(e);
    }
    return (
        <td 
            className={cssClassName}
            contentEditable={true}
            onBlur={updateShiftData}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            suppressContentEditableWarning={true}>
                {props.children}
        </td>
    )
}