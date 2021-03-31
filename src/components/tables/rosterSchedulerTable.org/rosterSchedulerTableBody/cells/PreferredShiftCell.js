import {useContext} from 'react';
import BorderedAlignCenterCell from '../../../cells/BorderedAlignCenterCell';
import SelectedRegionUtil from '../../../../../utils/SelectedRegionUtil';
import RosterWebContext from '../../../../../utils/RosterWebContext'; 
export default function PreferredShiftCell(props) {
  let {
    selectedRegion,
    setSelectedRegion
  } = useContext(RosterWebContext);
  function mouseEnterHandler(e){
    props.onMouseEnter(e);
    SelectedRegionUtil.updateSelect(e.target, selectedRegion,setSelectedRegion);
  }
  function mouseDownHandler(e){
    SelectedRegionUtil.startSelect(e.target,selectedRegion,setSelectedRegion);
  }
  
  const preferredShiftCellProps=Object.assign({},props);
  let cssClassName=props.className+" "+SelectedRegionUtil.getSelectedRegionCssClass(props.cellIndex,props.rowIndex,selectedRegion);
  cssClassName=cssClassName.trim();
  delete preferredShiftCellProps.className;
  delete preferredShiftCellProps.cellIndex;
  delete preferredShiftCellProps.rowIndex;
  return (
    <BorderedAlignCenterCell
      {...preferredShiftCellProps}
      className={cssClassName}
      contentEditable={true}
      onMouseDown={mouseDownHandler}
      onMouseEnter={mouseEnterHandler}
      suppressContentEditableWarning={true}
    >
      {props.children}
    </BorderedAlignCenterCell>
  );
}