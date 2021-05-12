import {useContext} from 'react';
import './EditableShiftCell.css';
import ShiftCell from './ShiftCell';
import RosterWebContext from '../../../../utils/RosterWebContext';
export default function EditableShiftCell(props){
    let {selectedRegionUtil,undoableRosterList,updateContext}=useContext(RosterWebContext);
    
    function copyData(e){
        e.preventDefault();
        selectedRegionUtil.copySelectedRegion(e.clipboardData);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function keyDown(e){
        console.log("keyDown");
        switch (e.which){
            case 37://handle left arrow key event
                    selectedRegionUtil.selectNextCell(e,-1,0);
                    updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    break;
            case 38://handle up arrow key event
                    selectedRegionUtil.selectNextCell(e,0,-1);
                    updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    break;              
            case 39://handle right arrow key event
                    selectedRegionUtil.selectNextCell(e,1,0);
                    updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    break;
            case 40://handle down arrow key event
                    selectedRegionUtil.selectNextCell(e,0,1);
                    updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
                    break;
            default:break;
        }
      }
    function mouseEnterHandler(e){
        e.preventDefault();
        selectedRegionUtil.updateSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil});
    }
    function mouseDownHandler(e){
        e.preventDefault();
        selectedRegionUtil.startSelect(e.target);
        updateContext({type:'updateSelectedRegion',value:selectedRegionUtil})
    }
    function pasteData(e){
        e.preventDefault();
        selectedRegionUtil.pasteCopiedRegion(e.clipboardData,undoableRosterList);
        console.log(undoableRosterList);
        updateContext({type:'updateRoster',value:undoableRosterList});
    }
    function updateValue(e){
        console.log("EditableShiftCell:updateValue");
        let oldValue=undoableRosterList.presentValue.rosterList[props.itoId].shiftList[e.target.cellIndex];
        //console.log("EditableShiftCell:updateValue:needUpdateContent:"+(oldValue!==e.target.textContent));
        /****************************************************************/
        /*The following steps are consuming very hight computing power, */
        /*so if the value not change do not execute the following step. */
        /****************************************************************/
        if (oldValue!==e.target.textContent){ 
            let temp=JSON.parse(JSON.stringify(undoableRosterList.presentValue));
            temp.rosterList[props.itoId].shiftList[e.target.cellIndex]=e.target.textContent;
            undoableRosterList.set(temp);        
            updateContext({type:'updateRoster',value:undoableRosterList});
        }
    }
    return(
        <ShiftCell
            {...props}
            contentEditable={true}
            onBlur={updateValue}
            onCopy={copyData}            
            onMouseDown={mouseDownHandler}
            onMouseEnter={mouseEnterHandler}
            onPaste={pasteData}
            suppressContentEditableWarning={true}>
            {props.children}
        </ShiftCell>
    )
}