import {useCallback,useContext,useEffect} from 'react';
import PreferredShiftRow from './PreferredShiftRow';
import RosterRow from './RosterRow';
import RosterWebContext from '../../../../utils/RosterWebContext';
import VacantShiftRow from './VacantShiftRow';
export default function XXBody(props){
    let [contextValue, updateContext]=useContext(RosterWebContext);
    let rowList=[],headerRowCount=3;
    Object.keys(contextValue.itoRosterList.presentValue).forEach(itoId=>{
        rowList.push(
            <RosterRow 
                duplicatShiftList={contextValue.allITOStat.duplicatShiftList[itoId]}
                itoId={itoId}
                key={itoId+'_shiftList'}
                rowIndex={rowList.length+headerRowCount}/>
        );
        
        rowList.push(
            <PreferredShiftRow
                itoId={itoId}
                key={itoId+'_preferredShiftList'}
                rowIndex={rowList.length+headerRowCount}/>
        )
        
    })
    let keyDown=useCallback((e)=>{
        console.log("keyDown");
        if (e.ctrlKey){
            switch (e.which){
                case 89: //Handle Ctrl-Y
                    e.preventDefault();
                    if (contextValue.itoRosterList.canRedo()){
                        contextValue.itoRosterList.redo();
                        updateContext({type:'updateRosterData', value:contextValue.itoRosterList});
                    }
                    break;
                case 90: //Handle Ctrl-Z
                    e.preventDefault();
                    if (contextValue.itoRosterList.canUndo()){
                        contextValue.itoRosterList.undo();
                        updateContext({type:'updateRosterData', value:contextValue.itoRosterList});
                    }
                    break
                default:break;    
            }
        }else {
            switch (e.which){
                case  9://handle tab key
                    if (e.shiftKey){
                        contextValue.selectedRegionUtil.selectNextCell(e,-1,0);
                    }else {
                        contextValue.selectedRegionUtil.selectNextCell(e,1,0);
                    }
                    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
					break;
                case 13://handle "Enter" key event
                    if (e.shiftKey){
                        contextValue.selectedRegionUtil.selectNextCell(e,0,-1);
                    } else {
                        contextValue.selectedRegionUtil.selectNextCell(e,0,1);
                    }
                    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
					break;
                case 27://handle "Esc" key event
                    contextValue.selectedRegionUtil.clearCopiedRegion();
                    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    break;                    
                case 37://handle left arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,-1,0);
                    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    break;
                case 38://handle up arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,0,-1);
                    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    break;
                case 39://handle right arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,1,0);
                    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    break;
                case 40://handle down arrow key event
                    contextValue.selectedRegionUtil.selectNextCell(e,0,1);
                    updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
                    break;
                case 46://handle delete key event
                    e.preventDefault();
                    contextValue.selectedRegionUtil.deleteData(
                        contextValue.activeShiftInfoList,
                        contextValue.monthlyCalendar.noOfWorkingDay,
                        contextValue.itoRosterList
                    );
                    updateContext({type:'updateRosterData',value:contextValue.itoRosterList});
                    break    
                default:break;
            }    
        }
    },[updateContext,
        contextValue.itoRosterList,
        contextValue.selectedRegionUtil,
        contextValue.activeShiftInfoList,
        contextValue.monthlyCalendar.noOfWorkingDay
    ]); 
    useEffect(()=>{
        document.addEventListener('keydown',keyDown);
        return () => {
            document.removeEventListener('keydown', keyDown)
        }
    },[keyDown,contextValue.itoRosterList]);        
    let mouseUp=useCallback((e)=>{
        console.log("mouse up");
        if (contextValue.selectedRegionUtil.isInSelectMode()){
            contextValue.selectedRegionUtil.endSelect();
            updateContext({type:'updateSelectedRegion',value:contextValue.selectedRegionUtil});
        }
    },[contextValue.selectedRegionUtil,updateContext]);
    useEffect(()=>{
        document.addEventListener('mouseup',mouseUp);
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    },[mouseUp]);
    return (
        <tbody>
            {rowList}
            <VacantShiftRow/> 
        </tbody>
    )
}