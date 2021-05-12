import {useContext} from 'react';
import './EditableShiftCell.css';
import ShiftCell from './ShiftCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function EditableShiftCell(props){
    let [contextValue,updateContext]=useContext(RosterWebContext);
    
    function copyData(e){
        e.preventDefault();
        contextValue.selectedRegionUtil.copySelectedRegion(e.clipboardData);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    }
    function keyDown(e){
        console.log("keyDown");
        switch (e.which){
            case 37://handle left arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,-1,0);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    })
                    break;
            case 38://handle up arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,0,-1);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    })
                    break;              
            case 39://handle right arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,1,0);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    })
                    break;
            case 40://handle down arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,0,1);
                    setTimeout(()=>{
                        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    })
                    break;
            default:break;
        }
      }
    function mouseEnterHandler(e){
        e.preventDefault();
        contextValue.selectedRegionUtil.updateSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
    }
    function mouseDownHandler(e){
        e.preventDefault();
        contextValue.selectedRegionUtil.startSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil})
    }
    function pasteData(e){
        e.preventDefault();
        contextValue.selectedRegionUtil.pasteCopiedRegion(e.clipboardData,contextValue.undoableRosterList);
        //console.log(undoableRosterList);
        updateContext({type:'updateRoster',value:contextValue.undoableRosterList});
    }
    function updateValue(e){
        e.preventDefault();
        console.log("EditableShiftCell:updateValue");
        let oldValue=contextValue.rosterList[props.itoId].shiftList.presentValue[e.target.cellIndex];
        //console.log("EditableShiftCell:updateValue:needUpdateContent:"+(oldValue!==e.target.textContent));
        /****************************************************************/
        /*The following steps are consuming very hight computing power, */
        /*so if the value not change do not execute the following step. */
        /****************************************************************/
        if (oldValue!==e.target.textContent){ 
            let temp=JSON.parse(JSON.stringify(contextValue.rosterList[props.itoId].shiftList.presentValue));
            temp[e.target.cellIndex]=e.target.textContent;

            contextValue.rosterList[props.itoId].shiftList.set(temp);        
            updateContext({type:'updateRoster',value:contextValue.rosterList});
        }
    }
    return(
        <ShiftCell
            {...props}
            contentEditable={true}
            onBlur={updateValue}
            onCopy={copyData}
            onKeyDown={keyDown}
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            onPaste={pasteData}
            suppressContentEditableWarning={true}>
            {props.children}
        </ShiftCell>
    )
}