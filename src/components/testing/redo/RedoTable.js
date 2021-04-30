import './RedoTable.css';
import {useEffect,useReducer,useState} from 'react';
import RedoBody from './RedoBody';
import RosterWebContext from '../../../utils/RosterWebContext';
import SelectedRegionUtil from './SelectedRegionUtil';
import TableHeader from '../../tables/tableHeader/TableHeader';
import useUndoUtil from './useUndoUtil';

export default function RedoTable(props){
    let rosterList=useUndoUtil(props.rosterTableData.rosterList);

    let hightLightCellIndex=-1;    
    let selectedRegionUtil=new SelectedRegionUtil(props.rosterTableData);
    let genParam=()=>{
        return {
            activeShiftInfoList:props.rosterTableData.shiftInfoList,
            calendarUtility:props.rosterTableData.calendarUtility,
            hightLightCellIndex:hightLightCellIndex,
            monthlyCalendar:props.rosterTableData.monthlyCalendar,
            rosterList:rosterList,
            selectedRegionUtil:selectedRegionUtil,
            systemParam:props.rosterTableData.systemParam,
        }
    }
    function contextValueReducer(state,action){
        switch (action.type){
            case 'pasteData':
                console.log(rosterList);
                return {
                    activeShiftInfoList:state.activeShiftInfoList,
                    calendarUtility:state.calendarUtility,
                    hightLightCellIndex:state.hightLightCellIndex,
                    monthlyCalendar:state.monthlyCalendar,
                    "rosterList":rosterList,
                    selectedRegionUtil:state.selectedRegionUtil,
                    systemParam:state.systemParam,
                }
            case "setHightLightCellIndex":
                return {
                    activeShiftInfoList:state.activeShiftInfoList,
                    calendarUtility:state.calendarUtility,
                    hightLightCellIndex:action.value,
                    monthlyCalendar:state.monthlyCalendar,
                    rosterList:state.rosterList,
                    selectedRegionUtil:state.selectedRegionUtil,
                    systemParam:state.systemParam,
                    
                }
            case "updateProps":
                return genParam();                
            case 'updateSelectedRegion':
                return {
                    activeShiftInfoList:state.activeShiftInfoList,
                    calendarUtility:state.calendarUtility,
                    hightLightCellIndex:state.hightLightCellIndex,
                    monthlyCalendar:state.monthlyCalendar,
                    rosterList:state.rosterList,
                    selectedRegionUtil:action.value,
                    systemParam:state.systemParam,
                }
            case "updateShiftValue":
                return {
                    activeShiftInfoList:state.activeShiftInfoList,
                    calendarUtility:state.calendarUtility,
                    hightLightCellIndex:state.hightLightCellIndex,
                    monthlyCalendar:state.monthlyCalendar,
                    rosterList:rosterList,
                    selectedRegionUtil:state.selectedRegionUtil,
                    systemParam:state.systemParam
                }
            default:
                return state;
        }
    }
    const [contextValue, updateContextValue] = useReducer(contextValueReducer, genParam());
    useEffect(()=>{
        rosterList.reset(props.rosterTableData.rosterList);
        updateContextValue({type:"updateProps"});
    },[props.rosterTableData])
    return (
        <table id="rosterTable">
            <RosterWebContext.Provider value={contextValue}>
                {contextValue.monthlyCalendar && <TableHeader noOfPrevDate={0}/>} 
                <RedoBody updateContextValue={updateContextValue}/>
            </RosterWebContext.Provider>
        </table>
    )        
}