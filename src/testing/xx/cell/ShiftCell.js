import {useContext} from 'react';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../utils/RosterWebContext';
import './ShiftCell.css';
export default function ShiftCell(props){
    let className="shiftCell"+((props.className)?" "+props.className:"");
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let myProps=Object.assign({},props);
    delete myProps.availableShiftList;
    delete myProps.itoId;
    delete myProps.rowIndex;
    delete myProps.setIsHighLightRow;
    if (props.availableShiftList.includes(props.children)){
        if(contextValue.activeShiftInfoList[props.children]){
            className=className+' '+contextValue.activeShiftInfoList[props.children].cssClassName;
        }
    }
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
            className={className}
            onMouseEnter={highLight}
            onMouseLeave={deHighLight}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}