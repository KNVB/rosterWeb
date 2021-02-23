import './ShiftCell.css';
import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../RosterWebContext';
export default function ShiftCell(props){
    let shiftClass ="p-0 shiftCell"+((props.className)?" "+props.className:"");
    let { activeShiftInfoList } = useContext(RosterWebContext);
    if (activeShiftInfoList[props.children]) {
        shiftClass +=  " " + activeShiftInfoList[props.children].cssClassName;    
    }

    //console.log(myProps);
    return (
        <BorderedAlignCenterCell {...props} className={shiftClass}>
            {props.children}
        </BorderedAlignCenterCell>
    );
}