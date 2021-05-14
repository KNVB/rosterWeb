import {useContext} from 'react';
import BorderedAlignCenterCell from '../cell/BorderedAlignCenterCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function XXCell(props){
    let className="shiftCell";
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
    let keyDown=e=>{
        console.log("keyDown");
        if (e.ctrlKey){
            switch (e.which){
                case 89: //Handle Ctrl-Y
                    e.preventDefault();
                    if (contextValue.rosterData.canRedo()){
                        contextValue.rosterData.redo();
                        updateContext({type:'updateRosterData', value:contextValue.rosterData})
                    }
                case 90: //Handle Ctrl-Z
                    e.preventDefault();
                    if (contextValue.rosterData.canUndo()){
                        contextValue.rosterData.undo();
                        updateContext({type:'updateRosterData', value:contextValue.rosterData})
                    }
                    break
            }
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
            onKeyDown={keyDown}
            suppressContentEditableWarning={true}>
            {props.children}
        </BorderedAlignCenterCell>
    )
}