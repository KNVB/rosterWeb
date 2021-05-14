import {useContext} from 'react';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
import "./EditableCell.css";
export default function XXCell(props){
    let className="editableCell";
    let [contextValue, updateContext]=useContext(RosterWebContext);
    
    let updateValue=(e)=>{
        let temp=JSON.parse(JSON.stringify(contextValue.rosterData.presentValue));
        let realX=e.target.cellIndex-contextValue.systemParam.noOfPrevDate;
        let oldValue=temp[props.itoId].rosterList.shiftList[realX];
        //console.log(oldValue+','+e.target.textContent+'='+(oldValue===e.target.textContent));
        if (oldValue!==e.target.textContent){
            temp[props.itoId].rosterList.shiftList[realX]=e.target.textContent;
            contextValue.rosterData.set(temp);
            updateContext({type:'updateRosterData', value:contextValue.rosterData})
        }
    }
    if (props.availableShiftList.includes(props.children)){
        if(contextValue.activeShiftInfoList[props.children]){
            className=className+' '+contextValue.activeShiftInfoList[props.children].cssClassName;
        }
    }

    return(
        <BorderedAlignCenterCell
            className={className}
            contentEditable={true}
            onBlur={updateValue}
            suppressContentEditableWarning={true}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}