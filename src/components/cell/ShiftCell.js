import {useContext} from 'react';
import BorderedAlignCenterCell from './BorderedAlignCenterCell';
import RosterWebContext from '../../utils/RosterWebContext';

import './ShiftCell.css';
export default function ShiftCell(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    let myProps=Object.assign({},props);
    
    delete myProps.availableShiftList;
    delete myProps.className;
    delete myProps.itoId;
    delete myProps.onMouseEnter
    delete myProps.rowIndex;    
    delete myProps.setIsHighLightRow;

    let classNameList=['shiftCell'];
    //console.log(props===undefined);
    if (props.availableShiftList.includes(props.children)){
        if(contextValue.activeShiftInfoList[props.children]){
            classNameList.push(contextValue.activeShiftInfoList[props.children].cssClassName);
        }
    }
    if (props.className){
        props.className.split(' ').forEach(className=>{
            classNameList.push(className);
        }) 
    }
    //console.log(myProps);
    function deHighLight(e){
        if(props.setIsHighLightRow){
            props.setIsHighLightRow(false);
        }
    }
    function highLight(e){
        //console.log(props===undefined);
        if (props.onMouseEnter){
            props.onMouseEnter(e);
        }
        if(props.setIsHighLightRow){
            props.setIsHighLightRow(true);
        }
        updateContext({type:"updateHighLightCellIndex",value:e.target.cellIndex})
    }   
    return(
        <BorderedAlignCenterCell
            {...myProps}
            className={classNameList.join(' ')}        
            onMouseEnter={highLight}
            onMouseLeave={deHighLight}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}