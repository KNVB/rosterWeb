import './ShiftCell.css';
import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cells/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function ShiftCell(props){
    const shiftCellProps=Object.assign({},props);
    let shiftClass ="p-0 shiftCell"+((props.className)?" "+props.className:"");
    let { activeShiftInfoList } = useContext(RosterWebContext);
    //let availableShiftList=props.availableShiftList;
    //console.log(props.availableShiftList);
    if (props.availableShiftList.includes(props.children)){
        if (activeShiftInfoList[props.children]) {
            shiftClass +=  " " + activeShiftInfoList[props.children].cssClassName;    
        }
    }
    delete shiftCellProps.availableShiftList;
    //console.log(myProps);
    return (
        <BorderedAlignCenterCell {...shiftCellProps} className={shiftClass}>
            {props.children}
        </BorderedAlignCenterCell>
    );
}