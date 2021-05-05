import {useContext} from 'react';
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';

import './ShiftCell.css';
export default function ShiftCell(props){
    let {activeShiftInfoList,undoableRosterList,updateContext}=useContext(RosterWebContext);
    let myProps=Object.assign({},props);
    delete myProps.className;
    delete myProps.itoId;
    delete myProps.mouseEnter
    delete myProps.rowIndex;    
    delete myProps.setIsHighLightRow;

    let classNameList=['shiftCell'];
    if(activeShiftInfoList[props.children]){
        classNameList.push(activeShiftInfoList[props.children].cssClassName);
    }
    if (props.className){
        classNameList.push(props.className);   
    }
    //console.log(myProps);
    function deHighLight(e){
        props.setIsHighLightRow(false);
    }
    function highLight(e){
        if (props.onMouseEnter){
            props.onMouseEnter(e);
        }
        props.setIsHighLightRow(true);
        updateContext({type:"updateHighLightCellIndex",value:e.target.cellIndex})
    }
    function updateValue(e){
        console.log("ShiftCell:updateValue");
        let oldValue=undoableRosterList.presentValue[props.itoId].shiftList[e.target.cellIndex];
        if (oldValue!==e.target.textContent){ 
            /****************************************************************/
            /*The following steps are consuming very hight computing power, */
            /*so if the value not change do not execute the following step. */
            /****************************************************************/
            let temp=JSON.parse(JSON.stringify(undoableRosterList.presentValue));
            temp[props.itoId].shiftList[e.target.cellIndex]=e.target.textContent;
            undoableRosterList.set(temp);        
            updateContext({type:'updateRoster',value:undoableRosterList});
        }
    }
    return(
        <BorderedAlignCenterCell
            {...myProps}
            className={classNameList.join(' ')}        
            onBlur={updateValue}
            onMouseEnter={highLight}
            onMouseLeave={deHighLight}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}