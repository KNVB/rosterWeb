import './ShiftCell.css';
import {useContext} from 'react';
import BorderedAlignCenterCell from '../../cells/borderedAlignCenterCell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../RosterWebContext';
export default function ShiftCell(props){
    let myProps={};
    let shiftClass = "p-0 shiftCell";

    let { activeShiftInfoList } = useContext(RosterWebContext);
    
    Object.keys(props).forEach(key => {
        myProps[key] = props[key];
    });

    if (activeShiftInfoList[props.children]) {
        shiftClass +=  " " + activeShiftInfoList[props.children].cssClassName;    
    }

    //console.log(myProps);
    return (
        <BorderedAlignCenterCell {...myProps} className={shiftClass}>
            {props.children}
        </BorderedAlignCenterCell>
    );
}