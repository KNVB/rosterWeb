import {useContext} from 'react';
import './ShiftCell.css';
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function ShiftCell(props){
    let cssClass="shiftCell"+((props.className)?" "+props.className:"");
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let myProps=Object.assign({},props);
    
    delete myProps.availableShiftList;
    delete myProps.className;
    delete myProps.itoId;
    delete myProps.onMouseEnter
    delete myProps.rowIndex;    
    delete myProps.setIsHighLightRow;

    if (props.availableShiftList.includes(props.children)){
        if(contextValue.activeShiftInfoList[props.children]){
            cssClass=cssClass+' '+contextValue.activeShiftInfoList[props.children].cssClassName;
        }
    }
    return (
        <BorderedAlignCenterCell 
            {...myProps}
            className={cssClass}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}